import io
import time
import base64
import array
import threading

import numpy as np
from flask import Flask, Response, jsonify, request
from PIL import Image

try:
    import tomllib  # py3.11+
except Exception:  # pragma: no cover
    import tomli as tomllib

from pathlib import Path
import sys

# Ensure we can import tcam.py from parent folder (python/)
this_dir = Path(__file__).resolve().parent
python_root = this_dir.parent
if str(python_root) not in sys.path:
    sys.path.insert(0, str(python_root))

from tcam import TCam
from palettes import palettes


with open(this_dir / "config.toml", "rb") as f:
    cfg = tomllib.load(f)
app = Flask(__name__)

# Add CORS headers manually
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

latest_jpeg = {"bytes": None}
stop_flag = False
current_palette = "gray"  # Default palette


def radiometric_to_jpeg(img_json: dict, palette_name: str = "gray") -> bytes:
    dec = base64.b64decode(img_json["radiometric"])  # 160x120 uint16
    ra = array.array("H", dec)
    a = np.frombuffer(ra, dtype=np.uint16).reshape(120, 160)
    mn = int(a.min())
    mx = int(a.max())
    if mx == mn:
        mx = mn + 1
    
    # Convert to 8-bit grayscale
    g = ((a - mn) * 255 / (mx - mn)).astype(np.uint8)
    
    # Apply palette if not grayscale
    if palette_name != "gray" and palette_name in palettes:
        palette = palettes[palette_name]
        # Convert grayscale to RGB using palette
        rgb_array = np.zeros((120, 160, 3), dtype=np.uint8)
        for i in range(120):
            for j in range(160):
                idx = g[i, j]
                rgb_array[i, j] = palette[idx]
        img = Image.fromarray(rgb_array, mode="RGB")
    else:
        # Use grayscale
        img = Image.fromarray(g, mode="L")
    
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=85)
    return buf.getvalue()


def stream_thread():
    while not stop_flag:
        cam = None
        try:
            print("[tcam-bridge] Starting camera connection...")
            cam = TCam()
            stat = cam.connect(cfg["camera_host"], cfg.get("camera_port", 5001))
            print(f"[tcam-bridge] Connect result: {stat}")
            
            if stat.get("status") != "connected":
                print("[tcam-bridge] Connection failed, retrying in 5 seconds...")
                time.sleep(5)
                continue
                
            print("[tcam-bridge] Starting stream...")
            cam.start_stream()
            
            frame_count = 0
            while not stop_flag:
                try:
                    f = cam.get_frame()
                    if f and "radiometric" in f:
                        latest_jpeg["bytes"] = radiometric_to_jpeg(f, current_palette)
                        frame_count += 1
                        if frame_count % 10 == 0:
                            print(f"[tcam-bridge] Processed {frame_count} frames")
                    else:
                        time.sleep(0.01)
                except Exception as e:
                    print(f"[tcam-bridge] Frame error: {e}")
                    break
                    
        except Exception as e:
            print(f"[tcam-bridge] Thread error: {e}")
            
        finally:
            if cam:
                try:
                    cam.shutdown()
                except:
                    pass
                    
        print("[tcam-bridge] Reconnecting in 5 seconds...")
        time.sleep(5)


@app.get("/health")
def health():
    return jsonify({"ok": True, "have_frame": latest_jpeg["bytes"] is not None, "current_palette": current_palette})


@app.get("/palettes")
def get_palettes():
    return jsonify({"palettes": list(palettes.keys()), "current": current_palette})


@app.post("/palette")
def set_palette():
    global current_palette
    data = request.get_json()
    palette_name = data.get("palette", "gray")
    
    if palette_name in palettes:
        current_palette = palette_name
        return jsonify({"success": True, "palette": current_palette})
    else:
        return jsonify({"success": False, "error": f"Palette '{palette_name}' not found"}), 400


@app.get("/mjpeg")
def mjpeg():
    boundary = "frame"

    def gen():
        last = None
        while True:
            b = latest_jpeg["bytes"]
            if b is not None and b is not last:
                yield (
                    b"--" + boundary.encode() + b"\r\n"
                    + b"Content-Type: image/jpeg\r\n\r\n" + b + b"\r\n"
                )
                last = b
            time.sleep(1.0 / max(cfg.get("fps_limit", 8), 1))

    return Response(gen(), mimetype=f"multipart/x-mixed-replace; boundary={boundary}")


@app.get("/")
def index():
    # Minimal landing page with links to known endpoints
    return (
        "<html><body>"
        "<h3>tCam Bridge</h3>"
        "<ul>"
        "<li><a href='/health'>/health</a></li>"
        "<li><a href='/mjpeg'>/mjpeg</a></li>"
        "</ul>"
        "</body></html>"
    )


if __name__ == "__main__":
    t = threading.Thread(target=stream_thread, daemon=True)
    t.start()
    app.run(host="0.0.0.0", port=8080, threaded=True, debug=False)


