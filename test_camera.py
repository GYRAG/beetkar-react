#!/usr/bin/env python3
"""
Test script to diagnose tCam-Mini connection and frame issues
"""
import sys
import time
from pathlib import Path

# Add python directory to path so we can import tcam
python_dir = Path(__file__).parent / "python"
sys.path.insert(0, str(python_dir))

from tcam import TCam

def test_camera_connection():
    print("=== tCam-Mini Connection Test ===")
    
    # Camera settings
    camera_ip = "10.19.243.3"
    camera_port = 5001
    
    print(f"Testing connection to {camera_ip}:{camera_port}")
    
    try:
        # Create camera instance
        print("Creating TCam instance...")
        cam = TCam(timeout=5, responseTimeout=15)
        
        # Test connection
        print("Connecting to camera...")
        result = cam.connect(camera_ip, camera_port)
        print(f"Connect result: {result}")
        
        if result.get("status") != "connected":
            print("❌ Failed to connect to camera")
            print("Possible issues:")
            print("- Camera not in STA mode")
            print("- Wrong IP address")
            print("- Camera already connected to another client")
            print("- Network connectivity issues")
            return False
        
        print("✅ Connected to camera successfully")
        
        # Test single image capture
        print("\nTesting single image capture...")
        try:
            image_result = cam.get_image()
            if image_result and "radiometric" in image_result:
                print("✅ Single image capture successful")
                print(f"Image data size: {len(image_result.get('radiometric', ''))} characters")
            else:
                print("❌ Single image capture failed")
                print(f"Result: {image_result}")
                return False
        except Exception as e:
            print(f"❌ Single image capture error: {e}")
            return False
        
        # Test streaming
        print("\nTesting streaming...")
        try:
            stream_result = cam.start_stream()
            print(f"Stream start result: {stream_result}")
            
            print("Getting frames from stream...")
            frame_count = 0
            for i in range(10):
                frame = cam.get_frame()
                if frame and "radiometric" in frame:
                    frame_count += 1
                    print(f"Frame {i+1}: ✅ Got frame with radiometric data")
                else:
                    print(f"Frame {i+1}: ❌ No frame or no radiometric data")
                time.sleep(0.5)
            
            if frame_count > 0:
                print(f"✅ Streaming successful - got {frame_count}/10 frames")
            else:
                print("❌ No frames received from stream")
                return False
                
        except Exception as e:
            print(f"❌ Streaming error: {e}")
            return False
        
        # Cleanup
        print("\nStopping stream and disconnecting...")
        cam.stop_stream()
        cam.shutdown()
        
        print("✅ All tests passed!")
        return True
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        return False

if __name__ == "__main__":
    success = test_camera_connection()
    if success:
        print("\n🎉 Camera is working correctly!")
        print("The issue might be in the bridge configuration or network setup.")
    else:
        print("\n💡 Troubleshooting steps:")
        print("1. Check camera IP address (ping 10.19.243.3)")
        print("2. Ensure camera is in STA mode, not AP mode")
        print("3. Disconnect any other clients using the camera")
        print("4. Power cycle the camera")
        print("5. Check network connectivity")
    
    sys.exit(0 if success else 1)
