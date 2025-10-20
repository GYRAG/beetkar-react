import io
import time
import base64
import array
import threading

import numpy as np
from flask import Flask, Response, jsonify, request
from PIL import Image
from scipy import ndimage

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
    
    # Apply Gaussian smoothing to reduce noise
    a_smooth = ndimage.gaussian_filter(a.astype(np.float32), sigma=0.5)
    
    # Apply histogram equalization for better contrast
    # Clip extreme values to avoid noise amplification
    a_clipped = np.clip(a_smooth, np.percentile(a_smooth, 2), np.percentile(a_smooth, 98))
    
    # Normalize to 0-255 range
    mn = a_clipped.min()
    mx = a_clipped.max()
    if mx == mn:
        mx = mn + 1
    
    # Convert to 8-bit with improved normalization
    g = ((a_clipped - mn) * 255 / (mx - mn)).astype(np.uint8)
    
    # Apply histogram equalization for better contrast distribution
    hist, bins = np.histogram(g.flatten(), 256, [0, 256])
    cdf = hist.cumsum()
    cdf_normalized = cdf * 255 / cdf[-1]
    g_eq = np.interp(g.flatten(), bins[:-1], cdf_normalized).reshape(g.shape).astype(np.uint8)
    
    # Apply palette if not grayscale using vectorized operations
    if palette_name != "gray" and palette_name in palettes:
        palette = palettes[palette_name]
        # Convert palette to numpy array for vectorized operations
        palette_array = np.array(palette, dtype=np.uint8)
        # Use advanced indexing for much faster color mapping
        rgb_array = palette_array[g_eq]
        img = Image.fromarray(rgb_array, mode="RGB")
        
        # Keep original resolution
    else:
        # Use grayscale with smoothing
        img = Image.fromarray(g_eq, mode="L")
    
    buf = io.BytesIO()
    # Increase JPEG quality for better color reproduction
    img.save(buf, format="JPEG", quality=95, optimize=True)
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
                print("[tcam-bridge] Connection failed, using mock thermal data...")
                # Generate mock thermal data for testing
                generate_mock_thermal_data()
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
            # Generate mock thermal data when camera fails
            generate_mock_thermal_data()
            
        finally:
            if cam:
                try:
                    cam.shutdown()
                except:
                    pass
                    
        print("[tcam-bridge] Reconnecting in 5 seconds...")
        time.sleep(5)


def generate_mock_thermal_data():
    """Generate mock thermal data for testing when camera is not available"""
    try:
        print("[tcam-bridge] Generating mock thermal data...")
        # Create a mock radiometric data structure
        mock_radiometric = {
            "radiometric": base64.b64encode(np.random.randint(20000, 30000, (120, 160), dtype=np.uint16).tobytes()).decode()
        }
        latest_jpeg["bytes"] = radiometric_to_jpeg(mock_radiometric, current_palette)
        print("[tcam-bridge] Mock thermal data generated")
    except Exception as e:
        print(f"[tcam-bridge] Error generating mock data: {e}")


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


@app.get("/capture")
def capture():
    """Capture a single image frame"""
    if latest_jpeg["bytes"] is None:
        return jsonify({"error": "No frame available"}), 404
    
    return Response(
        latest_jpeg["bytes"],
        mimetype="image/jpeg",
        headers={
            "Content-Disposition": f"attachment; filename=thermal_capture_{int(time.time())}.jpg"
        }
    )


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


