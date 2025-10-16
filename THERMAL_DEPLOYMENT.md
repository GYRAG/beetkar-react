# Thermal Camera Streaming Deployment Guide

This guide covers deploying the tCam-Mini thermal camera streaming system with your React website on Vercel and Cloudflare Tunnel.

## Architecture Overview

```
tCam-Mini (STA mode) → Python Bridge (Windows) → Cloudflare Tunnel → Vercel Website
```

- **tCam-Mini**: Thermal camera in Station (STA) mode on your local network
- **Python Bridge**: Flask server running on Windows, converts thermal data to MJPEG
- **Cloudflare Tunnel**: Exposes local bridge to internet via `bridge.beetkar.com`
- **Vercel Website**: React app with embedded thermal stream

## Prerequisites

- tCam-Mini thermal camera
- Windows PC with Python 3.11+
- Domain on Cloudflare (beetkar.com)
- Vercel account for hosting

## Step 1: Camera Setup

### Configure tCam-Mini for STA Mode
1. Connect tCam-Mini to power
2. Connect to its AP mode (default: `tCam-Mini-XXXX`)
3. Configure WiFi settings to connect to your home network
4. Note the assigned IP address (e.g., `10.19.243.3`)

### Test Camera Connection
```python
from tcam import TCam
cam = TCam()
result = cam.connect("10.19.243.3", 5001)
print(result)  # Should show {"status": "connected"}
```

## Step 2: Python Bridge Setup

### Install Dependencies
```powershell
cd python/bridge_app
py -m venv .venv
. .venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Configure Camera Settings
Edit `python/bridge_app/config.toml`:
```toml
camera_host = "10.19.243.3"  # Your tCam-Mini IP
camera_port = 5001
fps_limit = 8
```

### Start the Bridge
```powershell
cd python
python bridge_app/app.py
```

### Test Locally
- http://localhost:8080/health
- http://localhost:8080/mjpeg

## Step 3: Cloudflare Tunnel Setup

### Install Cloudflare Tunnel
```powershell
winget install Cloudflare.cloudflared
```

### Login to Cloudflare
```powershell
$exe = Get-ChildItem -Path "C:\Program Files","C:\Program Files (x86)","$env:LOCALAPPDATA","$env:ProgramData" -Recurse -Filter cloudflared.exe -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
& "$exe" tunnel login
```

### Create Named Tunnel
```powershell
& "$exe" tunnel create beetkar-bridge
```

### Route DNS
```powershell
& "$exe" tunnel route dns beetkar-bridge bridge.beetkar.com
```

### Create Config File
Create `C:\Users\gagan\.cloudflared\config.yml`:
```yaml
tunnel: 2f4cb38f-e137-4955-a7f8-03e650cff80c
credentials-file: C:\Users\gagan\.cloudflared\2f4cb38f-e137-4955-a7f8-03e650cff80c.json

ingress:
  - hostname: bridge.beetkar.com
    service: http://localhost:8080
  - service: http_status:404
```

### Start the Tunnel
```powershell
& "$exe" tunnel run beetkar-bridge
```

### Test Public Access
- https://bridge.beetkar.com/health
- https://bridge.beetkar.com/mjpeg

## Step 4: Vercel Deployment

### Environment Variables
In Vercel dashboard → Settings → Environment Variables:
- **Name**: `VITE_THERMAL_STREAM_URL`
- **Value**: `https://bridge.beetkar.com/mjpeg`
- **Environment**: Production, Preview

### Local Development
Create `.env.local`:
```bash
VITE_THERMAL_STREAM_URL=https://bridge.beetkar.com/mjpeg
```

### Deploy
```bash
npm run build
vercel --prod
```

## Step 5: Auto-Start Services (Optional)

### Install Tunnel as Windows Service
```powershell
& "$exe" service install
sc start cloudflared
```

### Create Bridge Startup Script
Create `start-thermal-bridge.bat`:
```batch
@echo off
cd /d C:\Users\gagan\Desktop\beetkar-react\python
python bridge_app/app.py
```

### Add to Windows Startup
1. Press `Win + R`, type `shell:startup`
2. Copy `start-thermal-bridge.bat` to the startup folder

## Troubleshooting

### Camera Connection Issues
- Verify tCam-Mini IP address
- Check network connectivity: `ping 10.19.243.3`
- Ensure only one client connects at a time
- Power cycle the camera if needed

### Tunnel Issues
- Check tunnel status: `& "$exe" tunnel info beetkar-bridge`
- Verify DNS: `nslookup bridge.beetkar.com`
- Clear browser cache if getting "site can't be reached"
- Check Cloudflare dashboard for DNS records

### Stream Not Working
- Verify Python bridge is running: http://localhost:8080/health
- Check tunnel logs for incoming requests
- Ensure `have_frame: true` in health response
- Test with incognito browser mode

### Performance Issues
- Adjust `fps_limit` in config.toml (lower = less CPU)
- Check network bandwidth for multiple viewers
- Consider reducing JPEG quality in app.py

## Security Considerations

### Network Security
- tCam-Mini should be on isolated network segment
- Use strong WiFi passwords
- Consider VPN access for remote monitoring

### Access Control
- Add authentication to bridge endpoints if needed
- Use Cloudflare Access for additional security
- Monitor tunnel usage in Cloudflare dashboard

## Monitoring

### Health Checks
- Monitor `/health` endpoint for camera status
- Set up alerts for `have_frame: false`
- Track tunnel connection status

### Logs
- Python bridge logs: Check terminal output
- Tunnel logs: Check cloudflared terminal
- Vercel logs: Check deployment logs

## Maintenance

### Regular Updates
- Update cloudflared: `winget upgrade Cloudflare.cloudflared`
- Update Python dependencies: `pip install -r requirements.txt --upgrade`
- Monitor for camera firmware updates

### Backup
- Backup tunnel credentials: `C:\Users\gagan\.cloudflared\*.json`
- Backup bridge config: `python/bridge_app/config.toml`
- Document camera IP and network settings

## Cost Considerations

### Cloudflare
- Tunnel: Free (up to 50 users)
- DNS: Free
- Bandwidth: Free (reasonable usage)

### Vercel
- Hosting: Free tier available
- Bandwidth: Included in plan

### Infrastructure
- tCam-Mini: One-time purchase
- Windows PC: Existing hardware
- Internet: Existing connection

## Next Steps

### Enhancements
- Add palette switching via `/palette` endpoint
- Implement WebSocket for real-time metadata
- Add temperature overlay on thermal images
- Create mobile-responsive thermal viewer

### Scaling
- Multiple camera support
- Load balancing for high traffic
- CDN for global distribution
- Database for historical data

## Support

### Documentation
- tCam-Mini: [Official docs](https://github.com/danjulio/tCam)
- Cloudflare Tunnel: [Cloudflare docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- Vercel: [Vercel docs](https://vercel.com/docs)

### Common Issues
- DNS propagation delays (5-30 minutes)
- Browser caching issues (clear cache)
- Camera connection timeouts (restart camera)
- Tunnel authentication (re-run `tunnel login`)

---

**Last Updated**: October 2024  
**Version**: 1.0  
**Compatible with**: tCam-Mini, Windows 10/11, Python 3.11+, Vercel, Cloudflare
