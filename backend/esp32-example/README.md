# ESP32 DHT11 Sensor Setup Guide

This guide will help you set up your ESP32 with a DHT11 sensor to upload temperature and humidity data to your Cloudflare Worker API.

## Hardware Requirements

- ESP32 development board
- DHT11 temperature and humidity sensor
- Jumper wires
- USB cable for programming
- Breadboard (optional)

## Wiring Diagram

```
DHT11 Sensor          ESP32
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VCC (Pin 1)    →     3.3V
DATA (Pin 2)   →     GPIO 4 (or any digital pin)
NC (Pin 3)     →     Not connected
GND (Pin 4)    →     GND
```

### Pin Layout (DHT11 - Front View)

```
  ┌─────────────┐
  │  1  2  3  4 │
  │  │  │  │  │ │
  └──┴──┴──┴──┴─┘
     │  │     │
    VCC│    GND
      DATA
```

**Note:** Some DHT11 modules have a built-in pull-up resistor. If yours doesn't, add a 10kΩ resistor between VCC and DATA pins.

## Software Setup

### 1. Install Arduino IDE

Download and install from: https://www.arduino.cc/en/software

### 2. Add ESP32 Board Support

1. Open Arduino IDE
2. Go to **File → Preferences**
3. In "Additional Board Manager URLs", add:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
4. Go to **Tools → Board → Boards Manager**
5. Search for "ESP32" and install "esp32 by Espressif Systems"

### 3. Install Required Libraries

1. Go to **Sketch → Include Library → Manage Libraries**
2. Search and install:
   - **DHT sensor library** by Adafruit
   - **Adafruit Unified Sensor** by Adafruit

### 4. Configure the Code

1. Open `sensor-upload.ino` in Arduino IDE
2. Update the following variables:

```cpp
// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";           // Your WiFi name
const char* password = "YOUR_WIFI_PASSWORD";   // Your WiFi password

// API endpoint - Update with your Cloudflare Worker URL
const char* serverUrl = "https://your-worker-name.your-subdomain.workers.dev/api/sensor-data";

// DHT11 configuration (change if using different pin)
#define DHTPIN 4  // GPIO pin connected to DHT11
```

### 5. Upload to ESP32

1. Connect ESP32 to your computer via USB
2. In Arduino IDE:
   - **Tools → Board** → Select your ESP32 board (e.g., "ESP32 Dev Module")
   - **Tools → Port** → Select the COM port for your ESP32
   - **Tools → Upload Speed** → 115200
3. Click the **Upload** button (→)
4. Wait for compilation and upload to complete

### 6. Monitor Serial Output

1. Open **Tools → Serial Monitor**
2. Set baud rate to **115200**
3. You should see:
   - WiFi connection status
   - Sensor readings
   - Upload confirmations

## Expected Serial Output

```
=================================
ESP32 DHT11 Sensor Data Upload
=================================

DHT11 sensor initialized
Connecting to WiFi: YourWiFiName
.....
WiFi connected!
IP address: 192.168.1.100
Signal strength (RSSI): -45 dBm

──────────────────────────────
🌡️  Temperature: 24.50 °C
💧 Humidity: 65.30 %
📤 Uploading to server... ✅ Success! Response code: 201
   Server response: {"success":true,"id":1,"message":"Sensor data stored successfully"}
──────────────────────────────
```

## Troubleshooting

### WiFi Connection Issues

**Problem:** ESP32 won't connect to WiFi

**Solutions:**
1. Double-check WiFi credentials (case-sensitive)
2. Ensure WiFi is 2.4GHz (ESP32 doesn't support 5GHz)
3. Move ESP32 closer to router
4. Check if WiFi has MAC address filtering enabled

### Sensor Reading Errors

**Problem:** "Failed to read from DHT sensor!"

**Solutions:**
1. Check wiring connections
2. Verify DHT11 is getting 3.3V power
3. Add a 10kΩ pull-up resistor if not included
4. Try a different GPIO pin
5. Sensor may need a few seconds to initialize after power-on

### Upload Errors

**Problem:** HTTP error codes (400, 500, etc.)

**Solutions:**
1. Verify the server URL is correct
2. Check that Cloudflare Worker is deployed
3. Test the API endpoint with curl or Postman
4. Review Serial Monitor for specific error messages

### Compilation Errors

**Problem:** Library not found

**Solutions:**
1. Install missing libraries via Library Manager
2. Restart Arduino IDE
3. Verify ESP32 board support is installed

## Configuration Options

### Change Upload Interval

Default is 5 seconds. To change:

```cpp
const unsigned long uploadInterval = 10000; // 10 seconds
```

### Change DHT Pin

```cpp
#define DHTPIN 5  // Use GPIO 5 instead of GPIO 4
```

### Use DHT22 Instead

```cpp
#define DHTTYPE DHT22  // Change from DHT11 to DHT22
```

## Power Consumption

- Active (WiFi on): ~160-260mA
- Deep sleep: ~10μA

For battery operation, consider implementing deep sleep between readings.

## Security Recommendations

1. **Use WPA2 encryption** on your WiFi network
2. **Don't hardcode credentials** for production - use WiFiManager library
3. **Enable HTTPS** (already configured in the code)
4. **Add authentication** if your API is publicly accessible

## Testing the Setup

### Test 1: Sensor Reading
Hold the DHT11 and check if temperature increases slightly from body heat.

### Test 2: API Connection
1. Upload code with Serial Monitor open
2. Look for "✅ Success! Response code: 201"
3. Check Cloudflare Worker logs for incoming requests

### Test 3: Dashboard Display
1. Open your web dashboard
2. Cards should update every 5 seconds
3. Charts should show historical data

## Next Steps

1. Mount ESP32 and sensor in weatherproof enclosure for outdoor use
2. Add battery backup for continuous operation
3. Implement OTA (Over-The-Air) updates for remote firmware updates
4. Add more sensors (pressure, light, etc.)

## Additional Resources

- [ESP32 Datasheet](https://www.espressif.com/en/products/socs/esp32)
- [DHT11 Datasheet](https://www.mouser.com/datasheet/2/758/DHT11-Technical-Data-Sheet-Translated-Version-1143054.pdf)
- [Adafruit DHT Library Guide](https://learn.adafruit.com/dht)

