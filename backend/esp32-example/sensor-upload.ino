/*
 * ESP32 Multi-Sensor Data Upload
 * 
 * This sketch reads data from BME688, ADXL345, and MAX9814 sensors
 * and uploads the data to a Cloudflare Worker API endpoint
 * 
 * Required Libraries:
 * - Adafruit BME680 Library
 * - Adafruit ADXL345 Library
 * - Adafruit Unified Sensor
 * 
 * Wiring:
 * BME688 VCC  -> ESP32 3.3V
 * BME688 GND  -> ESP32 GND
 * BME688 SDA  -> ESP32 GPIO 21
 * BME688 SCL  -> ESP32 GPIO 22
 * 
 * ADXL345 VCC -> ESP32 3.3V
 * ADXL345 GND -> ESP32 GND
 * ADXL345 SDA -> ESP32 GPIO 21
 * ADXL345 SCL -> ESP32 GPIO 22
 * 
 * MAX9814 VCC -> ESP32 3.3V
 * MAX9814 GND -> ESP32 GND
 * MAX9814 OUT -> ESP32 GPIO 34 (ADC1)
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME680.h>
#include <Adafruit_ADXL345_U.h>
#include <math.h>

// ---------- Pins ----------
#define SDA_PIN 21
#define SCL_PIN 22
#define MIC_PIN 34    // ESP32 ADC1 channel

// ---------- WiFi credentials ----------
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// API endpoint (replace with your Cloudflare Worker URL)
const char* serverUrl = "https://beetkar-sensor-api.testarosa.workers.dev/api/sensor-data";

// ---------- Globals ----------
Adafruit_BME680 bme;
Adafruit_ADXL345_Unified accel = Adafruit_ADXL345_Unified(12345);

// For mic DC removal
static float mic_dc = 2000.0f;
static const float dc_alpha = 0.001f;   // very slow DC tracker

// ---------- Audio calibration (optional for dB SPL) ----------
/*
  If you want a rough dB SPL:
  - Put MAX9814 in fixed gain (disable AGC), e.g. 60 dB.
  - Set your electret mic sensitivity (typical: -44 dBV/Pa).
  Then SPL ≈ 20*log10( Vrms / (V_per_Pa * 20e-6) )
*/
static const float MIC_SENS_DBV_PER_PA = -44.0f;  // electret typical; change if you know yours
static const float PREAMP_GAIN_DB      = 60.0f;   // MAX9814 fixed gain (AGC OFF). If AGC ON, this is pointless.
static const bool  PRINT_SPL_DB        = false;   // set true if you actually wired fixed gain and want SPL estimate

// ESP32 ADC assumptions (rough; ADC is not lab-grade)
static const float ADC_FS_COUNTS = 4095.0f;
static const float ADC_VREF      = 3.3f;         // with ADC_11db attenuation, ~3.3 V full scale
static const float SINE_FS_RMS   = (ADC_VREF / sqrtf(2.0f)); // full-scale sine RMS for dBFS ref

// Upload interval (milliseconds)
const unsigned long uploadInterval = 5000; // 5 seconds
unsigned long lastUploadTime = 0;

// ---------- Prototypes ----------
bool initBME(uint8_t addr);
void captureAudioWindow(float &rms_counts, int &p2p_counts);
void sampleVibrationRMS(float &rms_mps2, float &rms_g);

bool initBME(uint8_t addr) { return bme.begin(addr, &Wire); }

void setup() {
  Serial.begin(115200);
  delay(300);

  Serial.println("\n\n=================================");
  Serial.println("ESP32 Multi-Sensor Data Upload");
  Serial.println("=================================\n");

  // I2C fast enough to not be painful
  Wire.begin(SDA_PIN, SCL_PIN, 400000);

  // ----- BME688 -----
  if (!initBME(0x76) && !initBME(0x77)) {
    Serial.println("BME688 not found at 0x76/0x77. Check wiring.");
    while (1) delay(10);
  }
  bme.setTemperatureOversampling(BME680_OS_8X);
  bme.setHumidityOversampling(BME680_OS_2X);
  bme.setPressureOversampling(BME680_OS_4X);
  bme.setIIRFilterSize(BME680_FILTER_SIZE_3);
  bme.setGasHeater(320, 150); // 320 C, 150 ms
  Serial.println("BME688 sensor initialized");

  // ----- ADXL345 -----
  if (!accel.begin()) {
    Serial.println("ADXL345 not found (0x53). Check wiring.");
    while (1) delay(10);
  }
  accel.setRange(ADXL345_RANGE_2_G); // best resolution for vibration
  accel.setDataRate(ADXL345_DATARATE_800_HZ);
  Serial.println("ADXL345 sensor initialized");

  // ----- ADC for MAX9814 -----
  analogReadResolution(12);                  // 0..4095
  analogSetPinAttenuation(MIC_PIN, ADC_11db);// ~0..3.3 V approx
  Serial.println("MAX9814 sensor initialized");

  // Connect to WiFi
  connectToWiFi();
}

void loop() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected. Reconnecting...");
    connectToWiFi();
  }
  
  // Upload data at specified interval
  unsigned long currentTime = millis();
  if (currentTime - lastUploadTime >= uploadInterval) {
    lastUploadTime = currentTime;
    uploadSensorData();
  }
  
  // Small delay to prevent overwhelming the CPU
  delay(100);
}

/**
 * Connect to WiFi network
 */
void connectToWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    Serial.print("Signal strength (RSSI): ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm\n");
  } else {
    Serial.println("\nFailed to connect to WiFi. Check credentials and try again.");
  }
}

/**
 * Read sensor data and upload to API
 */
void uploadSensorData() {
  // ------- AUDIO -------
  float rms_counts; int p2p_counts;
  captureAudioWindow(rms_counts, p2p_counts);

  // Convert to volts RMS (approx), then to dBFS
  float vrms = (rms_counts / ADC_FS_COUNTS) * ADC_VREF;
  float dBFS = 20.0f * log10f( max(vrms / SINE_FS_RMS, 1e-9f) ); // relative to full-scale sine RMS

  // ------- VIBRATION -------
  float vib_rms_mps2, vib_rms_g;
  sampleVibrationRMS(vib_rms_mps2, vib_rms_g);

  // ------- BME688 -------
  if (!bme.performReading()) {
    Serial.println("BME688 read failed.");
    return;
  }
  
  float T = bme.temperature;                 // °C
  float H = bme.humidity;                    // %RH
  float P_hPa = bme.pressure / 100.0f;       // hPa convenience
  float P_atm = P_hPa / 1013.25f;            // atm
  float gas_kohm = bme.gas_resistance / 1000.0f;

  // Display readings
  Serial.println("──────────────────────────────");
  Serial.print("🌡️  Temperature: ");
  Serial.print(T, 2); Serial.println(" °C");
  Serial.print("💧 Humidity: ");
  Serial.print(H, 1); Serial.println(" %");
  Serial.print("⛽ Gas: ");
  Serial.print(gas_kohm, 2); Serial.println(" kΩ");
  Serial.print("📊 Pressure: ");
  Serial.print(P_atm, 3); Serial.println(" atm");
  Serial.print("📳 Vibration RMS: ");
  Serial.print(vib_rms_mps2, 3); Serial.println(" m/s²");
  Serial.print("🔊 Audio dBFS: ");
  Serial.print(dBFS, 1); Serial.println(" dBFS");

  // Prepare JSON payload
  String jsonPayload = "{";
  jsonPayload += "\"temperature\":" + String(T, 2) + ",";
  jsonPayload += "\"humidity\":" + String(H, 1) + ",";
  jsonPayload += "\"gas_resistance\":" + String(gas_kohm, 2) + ",";
  jsonPayload += "\"pressure\":" + String(P_atm, 3) + ",";
  jsonPayload += "\"vibration_rms\":" + String(vib_rms_mps2, 3) + ",";
  jsonPayload += "\"audio_dbfs\":" + String(dBFS, 1);
  jsonPayload += "}";
  
  // Send HTTP POST request
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    Serial.print("📤 Uploading to server... ");
    
    int httpResponseCode = http.POST(jsonPayload);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.print("✅ Success! Response code: ");
      Serial.println(httpResponseCode);
      Serial.print("   Server response: ");
      Serial.println(response);
    } else {
      Serial.print("❌ Error: ");
      Serial.println(httpResponseCode);
      Serial.print("   Error message: ");
      Serial.println(http.errorToString(httpResponseCode).c_str());
    }
    
    http.end();
  } else {
    Serial.println("❌ WiFi not connected!");
  }
  
  Serial.println("──────────────────────────────\n");
}

void captureAudioWindow(float &rms_counts, int &p2p_counts) {
  const int SAMPLES = 512;       // ~10 k samples/s -> ~51 ms window with 100 us delay
  long sumsq = 0;
  int vmin = 4095, vmax = 0;

  for (int i = 0; i < SAMPLES; i++) {
    int v = analogRead(MIC_PIN);
    if (v < vmin) vmin = v;
    if (v > vmax) vmax = v;

    // update DC offset slowly
    mic_dc = (1.0f - dc_alpha) * mic_dc + dc_alpha * v;

    float ac = float(v) - mic_dc;
    sumsq += long(ac * ac);

    delayMicroseconds(100); // ~10 kHz sample rate (coarse but fine for level)
  }

  p2p_counts = vmax - vmin;
  rms_counts = sqrtf(float(sumsq) / float(SAMPLES));
}

// Grab a short burst and compute RMS of acceleration after removing gravity/DC
void sampleVibrationRMS(float &rms_mps2, float &rms_g) {
  const int N = 256;   // samples
  // Target ~800 Hz rate: the data sheet rate; our I2C read rate will be lower. We'll approximate 400–800 Hz.
  // We'll just read as fast as practical and not obsess; we're computing RMS, not FFT.
  float mx = 0, my = 0, mz = 0;

  // First pass mean (to remove DC/gravity)
  sensors_event_t e;
  for (int i = 0; i < N; i++) {
    accel.getEvent(&e);
    mx += e.acceleration.x;
    my += e.acceleration.y;
    mz += e.acceleration.z;
    delayMicroseconds(1000); // ~1 kHz attempt
  }
  mx /= N; my /= N; mz /= N;

  // Second pass RMS of AC component
  double sumsq = 0;
  for (int i = 0; i < N; i++) {
    accel.getEvent(&e);
    float ax = e.acceleration.x - mx;
    float ay = e.acceleration.y - my;
    float az = e.acceleration.z - mz;
    float a_mag = sqrtf(ax*ax + ay*ay + az*az); // magnitude of vibration
    sumsq += double(a_mag) * double(a_mag);
    delayMicroseconds(1000);
  }

  rms_mps2 = sqrt(sumsq / double(N));
  rms_g    = rms_mps2 / 9.80665f;
}