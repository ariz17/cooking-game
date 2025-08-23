@echo off
echo Starting Cooking Game servers...
echo.

echo Starting backend server...
start "Backend Server" cmd /c "cd backend && mvnw.cmd spring-boot:run"

ping 127.0.0.1 -n 16 >nul

echo Starting frontend server...
start "Frontend Server" cmd /c "cd frontend && node server.js"

echo.
echo Servers started successfully!
echo Frontend: http://localhost:3001
echo Backend: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul