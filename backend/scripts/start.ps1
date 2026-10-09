Write-Host "🚀 Khởi động ApexCore Sovereign Exchange..." -ForegroundColor Yellow
if (Test-Path cmd/api-server/main.go) {
    go run cmd/api-server/main.go
} else {
    cd backend
    go run cmd/api-server/main.go
}
