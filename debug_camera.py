#!/usr/bin/env python3
"""
Debug script to test tCam-Mini with detailed logging
"""
import sys
import time
import base64
import array
from pathlib import Path

# Add python directory to path
python_dir = Path(__file__).parent / "python"
sys.path.insert(0, str(python_dir))

from tcam import TCam

def debug_camera():
    print("=== tCam-Mini Debug Test ===")
    
    camera_ip = "10.19.243.3"
    camera_port = 5001
    
    print(f"Testing camera at {camera_ip}:{camera_port}")
    
    try:
        # Create camera with different timeouts
        print("Creating TCam with extended timeouts...")
        cam = TCam(timeout=10, responseTimeout=30)
        
        # Test connection
        print("Connecting...")
        result = cam.connect(camera_ip, camera_port)
        print(f"Connect result: {result}")
        
        if result.get("status") != "connected":
            print("❌ Connection failed")
            return False
            
        print("✅ Connected successfully")
        
        # Test camera status
        print("Getting camera status...")
        try:
            status = cam.get_status()
            print(f"Status: {status}")
        except Exception as e:
            print(f"Status error: {e}")
        
        # Test camera config
        print("Getting camera config...")
        try:
            config = cam.get_config()
            print(f"Config: {config}")
        except Exception as e:
            print(f"Config error: {e}")
        
        # Test single image with different approaches
        print("\n=== Testing Image Capture ===")
        
        # Method 1: Direct get_image
        print("Method 1: Direct get_image()...")
        try:
            img1 = cam.get_image(timeout=10)
            print(f"Result type: {type(img1)}")
            print(f"Result keys: {img1.keys() if isinstance(img1, dict) else 'Not a dict'}")
            if isinstance(img1, dict) and "radiometric" in img1:
                print(f"✅ Got radiometric data: {len(img1['radiometric'])} chars")
            else:
                print(f"❌ No radiometric data: {img1}")
        except Exception as e:
            print(f"❌ get_image error: {e}")
        
        # Method 2: Start stream then get frame
        print("\nMethod 2: Start stream then get_frame()...")
        try:
            print("Starting stream...")
            stream_result = cam.start_stream()
            print(f"Stream result: {stream_result}")
            
            print("Waiting for frames...")
            for i in range(5):
                frame = cam.get_frame()
                print(f"Frame {i+1}: {type(frame)} - {frame.keys() if isinstance(frame, dict) else 'Not a dict'}")
                if frame and isinstance(frame, dict) and "radiometric" in frame:
                    print(f"✅ Got frame with radiometric data!")
                    break
                time.sleep(1)
            
            print("Stopping stream...")
            cam.stop_stream()
            
        except Exception as e:
            print(f"❌ Stream error: {e}")
        
        # Method 3: Try with different timeouts
        print("\nMethod 3: Try with different timeouts...")
        try:
            # Create new instance with different settings
            cam2 = TCam(timeout=5, responseTimeout=15)
            cam2.connect(camera_ip, camera_port)
            
            img3 = cam2.get_image(timeout=5)
            print(f"Result: {img3}")
            
            cam2.shutdown()
            
        except Exception as e:
            print(f"❌ Timeout test error: {e}")
        
        # Cleanup
        print("\nCleaning up...")
        cam.shutdown()
        
        return True
        
    except Exception as e:
        print(f"❌ Debug failed: {e}")
        return False

if __name__ == "__main__":
    debug_camera()
