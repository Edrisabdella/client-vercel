# install-deps.ps1 - Install server dependencies with specific versions

Write-Host "📦 Installing OpenLearn server dependencies..." -ForegroundColor Cyan

# Remove existing node_modules and package-lock
if (Test-Path "node_modules") {
    Write-Host "🗑️  Removing existing node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules
}

if (Test-Path "package-lock.json") {
    Remove-Item -Force package-lock.json
}

Write-Host "🔧 Installing dependencies with specific versions..." -ForegroundColor Yellow

# Install dependencies one by one to avoid conflicts
$dependencies = @(
    "express@4.18.2",
    "mongoose@7.5.0", 
    "bcryptjs@2.4.3",
    "jsonwebtoken@9.0.2",
    "cors@2.8.5",
    "dotenv@16.3.1",
    "multer@1.4.4",
    "nodemailer@6.9.4",
    "socket.io@4.7.2",
    "express-rate-limit@6.10.0",
    "helmet@7.0.0",
    "express-validator@7.0.1",
    "compression@1.7.4",
    "moment@2.29.4"
)

foreach ($dep in $dependencies) {
    Write-Host "Installing $dep..." -ForegroundColor Gray
    npm install $dep --save
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install $dep" -ForegroundColor Red
        exit 1
    }
}

# Install dev dependencies
$devDependencies = @(
    "nodemon@3.0.1",
    "kill-port@2.0.1",
    "jest@29.6.2",
    "supertest@6.3.3",
    "cross-env@7.0.3"
)

foreach ($dep in $devDependencies) {
    Write-Host "Installing $dep (dev)..." -ForegroundColor Gray
    npm install $dep --save-dev
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install $dep" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ All dependencies installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor White
Write-Host "1. Run: .\fix-server.ps1 (to start the server)" -ForegroundColor Gray
Write-Host "2. Run: npm test (to run tests)" -ForegroundColor Gray
Write-Host "3. Check that server starts on http://localhost:5001" -ForegroundColor Gray