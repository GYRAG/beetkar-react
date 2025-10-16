import io
import time
import base64
import array
import threading

import numpy as np
from flask import Flask, Response, jsonify
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


with open(this_dir / "config.toml", "rb") as f:
    cfg = tomllib.load(f)
app = Flask(__name__)

latest_jpeg = {"bytes": None}
stop_flag = False


def radiometric_to_jpeg(img_json: dict) -> bytes:
    dec = base64.b64decode(img_json["radiometric"])  # 160x120 uint16
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


def stream_thread():
    cam = TCam()
    stat = cam.connect(cfg["camera_host"], cfg.get("camera_port", 5001))
    if stat.get("status") != "connected":
        return
    cam.start_stream()
    while not stop_flag:
        f = cam.get_frame()
        if f and "radiometric" in f:
            latest_jpeg["bytes"] = radiometric_to_jpeg(f)
        else:
            time.sleep(0.005)


@app.get("/health")
def health():
    return jsonify({"ok": True, "have_frame": latest_jpeg["bytes"] is not None})


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
    app.run(host="0.0.0.0", port=8080, threaded=True)


