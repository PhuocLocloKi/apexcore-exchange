# ========================================================
# APEXCORE SOVEREIGN RUN SCRIPT (scripts/run.ps1)
# Founder: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
# ========================================================

Write-Host "🚀 KHỞI ĐỘNG HỆ THỐNG APEXCORE SOVEREIGN EXCHANGE" -ForegroundColor Yellow
Write-Host "👑 FOUNDER: NGUYỄN PHƯỚC LỘC (UID: 1107519625)" -ForegroundColor Cyan

Set-Location -Path "$PSScriptRoot\..\backend"
go run cmd/api-server/main.go
