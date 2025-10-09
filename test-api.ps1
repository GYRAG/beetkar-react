# Test script for Beetkar Sensor API
$WorkerUrl = "https://beetkar-sensor-api.testarosa.workers.dev"

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Beetkar Sensor API Test" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$WorkerUrl/health" -Method Get
    Write-Host "Success: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "Failed" -ForegroundColor Red
}
Write-Host ""

# Test 2: Post Test Data
Write-Host "Test 2: Posting 5 Sensor Readings" -ForegroundColor Yellow

$temps = @(24.5, 25.0, 24.8, 26.2, 23.9)
$hums = @(65.0, 64.5, 65.2, 63.8, 66.1)

for ($i = 0; $i -lt 5; $i++) {
    $body = @{
        temperature = $temps[$i]
        humidity = $hums[$i]
    } | ConvertTo-Json

    Write-Host "  Reading $($i+1): Temp=$($temps[$i]) Humidity=$($hums[$i])" -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri "$WorkerUrl/api/sensor-data" -Method Post -Body $body -ContentType "application/json"
        Write-Host "  Success!" -ForegroundColor Green
    } catch {
        Write-Host "  Failed" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 500
}
Write-Host ""

# Test 3: Get Latest
Write-Host "Test 3: Get Latest Reading" -ForegroundColor Yellow
try {
    $latest = Invoke-RestMethod -Uri "$WorkerUrl/api/sensor-data/latest" -Method Get
    Write-Host "Latest: Temp=$($latest.data.temperature) Humidity=$($latest.data.humidity)" -ForegroundColor Green
} catch {
    Write-Host "Failed" -ForegroundColor Red
}
Write-Host ""

# Test 4: Get History
Write-Host "Test 4: Get History" -ForegroundColor Yellow
try {
    $history = Invoke-RestMethod -Uri "$WorkerUrl/api/sensor-data/history?range=7d" -Method Get
    Write-Host "Retrieved $($history.data.Count) readings" -ForegroundColor Green
} catch {
    Write-Host "Failed" -ForegroundColor Red
}
Write-Host ""

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Tests Complete!" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Cyan
