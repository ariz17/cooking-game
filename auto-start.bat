@echo off
title Cooking Game - Auto Startup
echo ========================================
echo    Cooking Game - Auto Startup
echo ========================================
echo.

echo This will start the local keepalive service that automatically
echo manages both backend and frontend servers.
echo.
echo The keepalive service will:
echo - Start both servers automatically
echo - Monitor them every 30 seconds
echo - Restart them if they crash
echo - Keep them running in the background
echo.

echo Starting local keepalive service...
node local-keepalive.js
