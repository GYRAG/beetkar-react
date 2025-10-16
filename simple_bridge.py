#!/usr/bin/env python3
"""
Simple thermal bridge - minimal approach
"""
import sys
import time
import base64
import array
import io
import threading
from pathlib import Path

# Add python directory to path
python_dir = Path(__file__).parent / "python"
sys.path.insert(0, str(python_dir))

from tcam import TCam
from flask import Flask, Response, jsonify
from PIL import Image
import numpy as np

app = Flask(__name__)
latest_jpeg = {"bytes": None}
stop_flag = False

def radiometric_to_jpeg(img_json):
    """Convert radiometric data to JPEG"""
    try:
        dec = base64.b64decode(img_json["radiometric"])
        ra = array.array("H", dec)
        a = np.frombuffer(ra, dtype=np.uint16).reshape(120, 160)
        mn = int(a.min())
        mx = int(a.max())
        if mx == mn:
            mx = mn + 1
        g = ((a - mn) * 255 / (mx - mn)).astype(np.uint8)
        img = Image.fromarray(g, mode="L")
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=85)
        return buf.getvalue()
    except Exception as e:
        print(f"Conversion error: {e}")
        return None

def capture_loop():
    """Simple capture loop"""
    global latest_jpeg
    
    while not stop_flag:
        cam = None
        try:
            print("[simple-bridge] Creating camera...")
            cam = TCam(timeout=5, responseTimeout=10)
            
            print("[simple-bridge] Connecting...")
            result = cam.connect("10.19.243.3", 5001)
            print(f"[simple-bridge] Connect: {result}")
            
            if result.get("status") != "connected":
                time.sleep(5)
                continue
                
            print("[simple-bridge] Connected! Capturing images...")
            
            # Capture loop
            for i in range(100):  # Capture 100 images then reconnect
                if stop_flag:
                    break
                    
                try:
                    img = cam.get_image(timeout=5)
                    if img and "radiometric" in img:
                        jpeg_bytes = radiometric_to_jpeg(img)
                        if jpeg_bytes:
                            latest_jpeg["bytes"] = jpeg_bytes
                            print(f"[simple-bridge] Captured image {i+1}, size: {len(jpeg_bytes)} bytes")
                        else:
                            print(f"[simple-bridge] Conversion failed for image {i+1}")
                    else:
                        print(f"[simple-bridge] No image data: {img}")
                    
                    time.sleep(0.5)  # 2 FPS
                    
                except Exception as e:
                    print(f"[simple-bridge] Capture error: {e}")
                    break
                    
        except Exception as e:
            print(f"[simple-bridge] Error: {e}")
            
        finally:
            if cam:
                try:
                    cam.shutdown()
                except:
                    pass
                    
        print("[simple-bridge] Reconnecting in 5 seconds...")
        time.sleep(5)

@app.route("/health")
def health():
    return jsonify({"ok": True, "have_frame": latest_jpeg["bytes"] is not None})

@app.route("/mjpeg")
def mjpeg():
    def gen():
        while True:
            if latest_jpeg["bytes"]:
                yield (b"--frame\r\n"
                       b"Content-Type: image/jpeg\r\n\r\n" + 
                       latest_jpeg["bytes"] + b"\r\n")
            time.sleep(0.5)
    
    return Response(gen(), mimetype="multipart/x-mixed-replace; boundary=frame")

@app.route("/")
def index():
    return "<h1>Simple Thermal Bridge</h1><p><a href='/health'>Health</a> | <a href='/mjpeg'>MJPEG</a></p>"

if __name__ == "__main__":
    print("Starting simple thermal bridge...")
    t = threading.Thread(target=capture_loop, daemon=True)
    t.start()
    app.run(host="0.0.0.0", port=8080, debug=True)
