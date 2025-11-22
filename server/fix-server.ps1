# fix-server.ps1 - Fix server port and startup issues

Write-Host "🚀 Fixing OpenLearn server issues..." -ForegroundColor Cyan

# Kill any processes using port 5000 or 5001
Write-Host "🛑 Killing processes on ports 5000 and 5001..." -ForegroundColor Yellow

$ports = @(5000, 5001)
foreach ($port in $ports) {
    $process = netstat -ano | findstr ":$port" | findstr "LISTENING"
    if ($process) {
        $pidMatch = [regex]::Match($process, 'LISTENING\s+(\d+)')
        if ($pidMatch.Success) {
            $pidToKill = $pidMatch.Groups[1].Value
            Write-Host "Killing process $pidToKill on port $port"
            taskkill /PID $pidToKill /F 2>$null
        }
    }
}

Write-Host "✅ Ports cleared. Waiting 3 seconds..." -ForegroundColor Green
Start-Sleep -Seconds 3

# Update .env to use port 5001 to avoid conflicts
Write-Host "🔧 Updating server configuration..." -ForegroundColor Yellow

if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    $envContent = $envContent -replace 'PORT=5000', 'PORT=5001'
    $envContent | Set-Content ".env"
    Write-Host "✅ Updated .env to use PORT=5001" -ForegroundColor Green
}

# Start the server
Write-Host "🚀 Starting OpenLearn server on port 5001..." -ForegroundColor Cyan
npm run dev