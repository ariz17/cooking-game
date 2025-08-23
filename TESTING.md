# Cooking Game Testing Guide

## Prerequisites
Before testing, ensure you have:
- Java 17 or higher
- Maven
- Node.js and npm
- Two terminal/command prompt windows

## Automated Testing Script

Create a file called `test-connection.sh` (for macOS/Linux) or `test-connection.bat` (for Windows) with the following content:

### Startup Script
For an easier way to start both servers, create a file called `start-game.sh` (macOS/Linux) with the following content:

```bash
#!/bin/bash

# Cooking Game Startup Script

echo "Starting Cooking Game..."

# Function to clean up background processes
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C to clean up
trap cleanup INT

# Start backend server
echo "Starting backend server..."
cd backend
./mvnw spring-boot:run &
BACKEND_PID=$!
cd ..

# Start frontend server
echo "Starting frontend server..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo "Servers starting..."
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Access the game at: http://localhost:3001"
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
```

For Windows, create a file called `start-game.bat` with the following content:

```batch
@echo off
echo Starting Cooking Game...

echo Starting backend server...
cd backend
start "Backend Server" /D "%CD%" cmd /c "mvnw spring-boot:run"
cd ..

echo Starting frontend server...
cd frontend
start "Frontend Server" /D "%CD%" cmd /c "npm start"
cd ..

echo.
echo Servers starting...
echo Access the game at: http://localhost:3001
echo Close both terminal windows to stop the servers
echo.

pause
```

### For macOS/Linux (`test-connection.sh`):
```bash
#!/bin/bash

echo "Testing Cooking Game Connection..."

# Test backend health endpoint
echo "1. Testing backend health endpoint..."
curl -s http://localhost:3000/api/gamedata/health || echo "Backend health endpoint not accessible"

# Test backend game data endpoint
echo "2. Testing backend game data endpoint..."
curl -s http://localhost:3000/api/gamedata | grep -q "recipes" && echo "Backend game data endpoint working" || echo "Backend game data endpoint not accessible"

# Test frontend server
echo "3. Testing frontend server..."
curl -s http://localhost:3001 | grep -q "Order Up" && echo "Frontend server working" || echo "Frontend server not accessible"

echo "Testing complete. Check results above."
```

### For Windows (`test-connection.bat`):
```batch
@echo off
echo Testing Cooking Game Connection...

echo 1. Testing backend health endpoint...
curl -s http://localhost:3000/api/gamedata/health >nul 2>&1
if %errorlevel% == 0 (
    echo Backend health endpoint working
) else (
    echo Backend health endpoint not accessible
)

echo 2. Testing backend game data endpoint...
curl -s http://localhost:3000/api/gamedata | findstr "recipes" >nul 2>&1
if %errorlevel% == 0 (
    echo Backend game data endpoint working
) else (
    echo Backend game data endpoint not accessible
)

echo 3. Testing frontend server...
curl -s http://localhost:3001 | findstr "Order Up" >nul 2>&1
if %errorlevel% == 0 (
    echo Frontend server working
) else (
    echo Frontend server not accessible
)

echo Testing complete. Check results above.
```

## Manual Testing Steps

### Step 1: Start the Backend Server
1. Open a terminal
2. Navigate to the `backend` directory
3. Run: `./mvnw spring-boot:run` (or `mvn spring-boot:run` if you have Maven installed)
4. Wait for the message: "Started CookingGameApplication in X seconds"

### Step 2: Start the Frontend Server
1. Open a second terminal
2. Navigate to the `frontend` directory
3. Run: `npm install` (if you haven't already)
4. Run: `npm start`
5. Wait for the message: "Frontend server running on port 3001"

### Step 3: Test Backend Endpoints
1. Open your browser and go to: http://localhost:3000/api/gamedata/health
   - You should see: "OK"
2. Go to: http://localhost:3000/api/gamedata
   - You should see JSON data with recipes and ingredients

### Step 4: Test Frontend Connection
1. Open your browser and go to: http://localhost:3001
2. You should see:
   - Loading screen with "Connecting to backend server..." message
   - After a few seconds, the message should change to "Connected to backend successfully!" in green
   - Then the game interface should appear

### Step 5: Play the Game
1. Click "Next" to choose a chef
2. Enter your name and click "Continue"
3. Select a background and click "Start Game"
4. You should see:
   - Customer image
   - Order details
   - Ingredient buttons
   - Timer counting down

## Common Issues and Solutions

### Backend Not Starting
- Check that port 3000 is available
- Ensure Java 17+ is installed and in your PATH
- Check the terminal for error messages

### Frontend Not Connecting to Backend
- Ensure both servers are running
- Check that port 3000 (backend) and 3001 (frontend) are both available
- Check the browser console (F12) for error messages
- Verify the proxy configuration in `frontend/server.js`

### Game Data Not Loading
- Check the browser console for JavaScript errors
- Verify the backend endpoints are accessible
- Check that the frontend is making requests to the correct URLs

## Success Criteria
When everything is working correctly, you should see:
1. Backend server running on port 3000
2. Frontend server running on port 3001
3. Frontend successfully connecting to backend
4. Game data loading correctly
5. Ability to play the game without errors