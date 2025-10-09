/*
 * ESP32 DHT11 Sensor Data Upload
 * 
 * This sketch reads temperature and humidity from a DHT11 sensor
 * and uploads the data to a Cloudflare Worker API endpoint
 * 
 * Required Libraries:
 * - DHT sensor library by Adafruit
 * - Adafruit Unified Sensor
 * 
 * Wiring:
 * DHT11 VCC  -> ESP32 3.3V
 * DHT11 GND  -> ESP32 GND
 * DHT11 DATA -> ESP32 GPIO 4 (can be changed below)
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// API endpoint (replace with your Cloudflare Worker URL)
const char* serverUrl = "https://your-worker-name.your-subdomain.workers.dev/api/sensor-data";

// DHT11 sensor configuration
#define DHTPIN 4          // GPIO pin connected to DHT11 data pin
#define DHTTYPE DHT11     // DHT11 sensor type
DHT dht(DHTPIN, DHTTYPE);

// Upload interval (milliseconds)
const unsigned long uploadInterval = 5000; // 5 seconds
unsigned long lastUploadTime = 0;

void setup() {
  // Initialize serial communication
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n=================================");
  Serial.println("ESP32 DHT11 Sensor Data Upload");
  Serial.println("=================================\n");
  
  // Initialize DHT sensor
  dht.begin();
  Serial.println("DHT11 sensor initialized");
  
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
  // Read humidity and temperature
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  
  // Check if readings are valid
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("❌ Failed to read from DHT sensor!");
    return;
  }
  
  // Display readings
  Serial.println("──────────────────────────────");
  Serial.print("🌡️  Temperature: ");
  Serial.print(temperature);
  Serial.println(" °C");
  Serial.print("💧 Humidity: ");
  Serial.print(humidity);
  Serial.println(" %");
  
  // Prepare JSON payload
  String jsonPayload = "{\"temperature\":";
  jsonPayload += String(temperature, 2);
  jsonPayload += ",\"humidity\":";
  jsonPayload += String(humidity, 2);
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

