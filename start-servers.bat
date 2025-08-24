@echo off
title Cooking Game - Quick Start
echo Starting Cooking Game servers...
echo.

echo Starting backend server...
start "Backend Server" cmd /k "cd /d %~dp0backend && mvnw.cmd spring-boot:run"

echo Waiting for backend to initialize...
ping 127.0.0.1 -n 16 >nul

echo Starting frontend server...
start "Frontend Server" cmd /k "cd /d %~dp0frontend && node server.js"

echo.
echo Servers started successfully!
echo Frontend: http://localhost:3001
echo Backend: http://localhost:3000
echo Backend Health: http://localhost:3000/actuator/health
echo.
echo Both servers will keep running in separate windows.
echo Close those windows to stop the servers.
echo.
echo Press any key to open the game...
pause >nul
start http://localhost:3001