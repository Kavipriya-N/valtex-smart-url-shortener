## diagnostics.ps1

# Diagnostic script for VALTEX project
# Collects environment info, node modules, MongoDB status, and API health.

Write-Host "=== SERVER .env ==="
if (Test-Path "server/.env") {
    Get-Content "server/.env"
} else { Write-Host "server/.env MISSING" }

Write-Host "\n=== CLIENT .env ==="
if (Test-Path "client/.env") { Get-Content "client/.env" } else { Write-Host "client/.env MISSING" }

Write-Host "\n=== NODE_MODULES COUNT ==="
$serverModules = (Get-ChildItem "server/node_modules" -Directory -ErrorAction SilentlyContinue | Measure-Object).Count
$clientModules = (Get-ChildItem "client/node_modules" -Directory -ErrorAction SilentlyContinue | Measure-Object).Count
Write-Host "Server node_modules count: $serverModules"
Write-Host "Client node_modules count: $clientModules"

Write-Host "\n=== BCRYPTJS INSTALLED? ==="
if (Test-Path "server/node_modules/bcryptjs") { Write-Host "bcryptjs present" } else { Write-Host "bcryptjs NOT installed" }

Write-Host "\n=== JSONWEBTOKEN INSTALLED? ==="
if (Test-Path "server/node_modules/jsonwebtoken") { Write-Host "jsonwebtoken present" } else { Write-Host "jsonwebtoken NOT installed" }

Write-Host "\n=== SERVER PACKAGE.JSON ==="
if (Test-Path "server/package.json") { Get-Content "server/package.json" } else { Write-Host "server/package.json missing" }

Write-Host "\n=== AUTH CONTROLLER ==="
if (Test-Path "server/controllers/authController.js") { Get-Content "server/controllers/authController.js" } else { Write-Host "authController.js missing" }

Write-Host "\n=== USER MODEL ==="
if (Test-Path "server/models/User.js") { Get-Content "server/models/User.js" } else { Write-Host "User.js missing" }

Write-Host "\n=== MONGODB PING ==="
# Attempt mongosh if available
$mongosh = Get-Command mongosh -ErrorAction SilentlyContinue
if ($mongosh) {
    try {
        mongosh --eval "db.adminCommand('ping')" | Write-Host
    } catch {
        Write-Host "mongosh error: $_"
    }
} else {
    Write-Host "mongosh not found; checking if port 27017 is listening"
    netstat -ano | Select-String ":27017" | Write-Host
}

Write-Host "\n=== LIST USERS (first 20) ==="
if ($mongosh) {
    try {
        mongosh valtex --eval "db.users.find({},{email:1,_id:0}).limit(20).pretty()" | Write-Host
    } catch { Write-Host "mongosh error: $_" }
} else { Write-Host "mongosh not available; cannot list users" }

Write-Host "\n=== USER COUNT ==="
if ($mongosh) {
    try {
        mongosh valtex --eval "db.users.countDocuments()" | Write-Host
    } catch { Write-Host "mongosh error: $_" }
} else { Write-Host "mongosh not available; cannot count users" }

Write-Host "\n=== API HEALTH ==="
try {
    $resp = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -ErrorAction Stop
    $resp.Content | Write-Host
} catch { Write-Host "Health endpoint error: $_" }

Write-Host "\n=== TEST LOGIN ENDPOINT ==="
$loginPayload = '{"email":"test@test.com","password":"test123"}'
try {
    $loginResp = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginPayload -ContentType "application/json" -UseBasicParsing -ErrorAction Stop
    $loginResp.Content | Write-Host
} catch { Write-Host "Login request error: $_" }
