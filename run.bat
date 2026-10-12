@echo off
chcp 65001 >nul
echo ==================================================
echo [APEXCORE LAUNCHER] Dang kiem tra cong 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
    echo [APEXCORE LAUNCHER] Phat hien tien trinh cu (PID: %%a), dang tu dong don dep...
    taskkill /f /pid %%a >nul 2>&1
)
echo [APEXCORE LAUNCHER] Cong 5000 da san sang 100%!
echo [APEXCORE LAUNCHER] Khoi dong ApexCore Cyber-Quantum Server V17...
echo ==================================================
go run backend/cmd/api-server/main.go
pause
