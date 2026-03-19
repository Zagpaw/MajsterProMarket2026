$bestIP = (Get-NetIPAddress -AddressFamily IPv4 | 
    Where-Object { $_.IPAddress -notmatch '^(127\.|169\.254\.)' } | 
    Select-Object -First 1).IPAddress

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Twoje IP: $bestIP" -ForegroundColor Green
Write-Host "Użyj w config.ts:" -ForegroundColor Yellow
Write-Host "  return 'http://${bestIP}:5000/api';" -ForegroundColor White
Write-Host "==================================" -ForegroundColor Cyan

# Test połączenia
try {
    $response = Invoke-WebRequest -Uri "http://${bestIP}:5000/api/item" -TimeoutSec 3;
    Write-Host "[OK] API odpowiada!" -ForegroundColor Green
}
catch {
    Write-Host "[FAIL] Nie mozna polaczyc sie z API" -ForegroundColor Red
}