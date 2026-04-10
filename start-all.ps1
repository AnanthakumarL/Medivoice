# Medi-Hub Full Stack Startup Script
Write-Host "Starting Medi-Hub Full Stack Application..." -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
$mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "MongoDB is already running" -ForegroundColor Green
} else {
    Write-Host "MongoDB is not running. Please start MongoDB first." -ForegroundColor Red
    Write-Host "Run as admin: net start MongoDB" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Starting services in new windows..." -ForegroundColor Cyan
Write-Host ""

# Start Backend
Write-Host "Starting Backend Server on port 5000..." -ForegroundColor Green
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Backend Server' -ForegroundColor Cyan; npm run dev"

Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend on port 8080..." -ForegroundColor Green
$frontendPath = Join-Path $PSScriptRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'Frontend' -ForegroundColor Cyan; npm run dev"

Start-Sleep -Seconds 2

# Start AI Chatbot
Write-Host "Starting AI Chatbot on port 5001..." -ForegroundColor Green
$chatbotPath = Join-Path $PSScriptRoot "chatbot"
if (Test-Path $chatbotPath) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$chatbotPath'; Write-Host 'AI Chatbot' -ForegroundColor Cyan; python app.py"
} else {
    Write-Host "Chatbot directory not found, skipping..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "All services starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "Access the application at:" -ForegroundColor Cyan
Write-Host "  Frontend:  http://localhost:8080" -ForegroundColor White
Write-Host "  Backend:   http://localhost:5000" -ForegroundColor White
Write-Host "  Chatbot:   http://localhost:5001" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit (services will continue running)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
