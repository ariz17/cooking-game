@echo off
echo Starting Cooking Game servers...
echo.

echo Starting backend server...
start "Backend Server" cmd /k "cd backend && mvnw.cmd spring-boot:run"

timeout /t 10 /nobreak >nul

echo Starting frontend server...
start "Frontend Server" cmd /k "cd frontend && node server.js"

echo.
echo Servers started successfully!
echo Frontend: http://localhost:3001
echo Backend: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul