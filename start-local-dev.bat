@echo off
title Cooking Game - Local Development
echo ========================================
echo    Cooking Game - Local Development
echo ========================================
echo.

echo Checking if backend is already running...
netstat -an | find "LISTENING" | find ":3000" >nul
if %errorlevel% == 0 (
    echo Backend is already running on port 3000
) else (
    echo Starting backend server...
    start "Backend Server" cmd /k "cd /d %~dp0backend && echo Starting Spring Boot backend... && mvnw.cmd spring-boot:run"
    echo Waiting for backend to start...
    timeout /t 15 /nobreak >nul
)

echo.
echo Checking if frontend is already running...
netstat -an | find "LISTENING" | find ":3001" >nul
if %errorlevel% == 0 (
    echo Frontend is already running on port 3001
) else (
    echo Starting frontend server...
    start "Frontend Server" cmd /k "cd /d %~dp0frontend && echo Starting frontend server... && node server.js"
    timeout /t 3 /nobreak >nul
)

echo.
echo ========================================
echo    Servers Status
echo ========================================
echo Frontend: http://localhost:3001
echo Backend:  http://localhost:3000
echo Backend Health: http://localhost:3000/actuator/health
echo.
echo Both servers are starting in separate windows.
echo You can close this window safely.
echo.
echo Press any key to open the game in browser...
pause >nul

start http://localhost:3001
