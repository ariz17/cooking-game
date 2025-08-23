# Cooking Game - Backend Server Fix

## Problem
The game's backend server wasn't loading properly, preventing the frontend from connecting to it.

## Solution Applied
1. Removed duplicate project structure in `backend/src/src/` that was causing confusion
2. Fixed incorrect port number in error message (was showing 8081, should be 3000)

## How to Start the Game

### Prerequisites
- Java 17 or higher
- Maven
- Node.js and npm

### Starting the Backend Server
1. Open a terminal/command prompt
2. Navigate to the `backend` directory:
   ```
   cd backend
   ```
3. Start the Spring Boot application:
   ```
   ./mvnw spring-boot:run
   ```
   Or if you have Maven installed:
   ```
   mvn spring-boot:run
   ```
   
   The backend will start on port 3000 (http://localhost:3000).

### Starting the Frontend Server
1. Open a separate terminal/command prompt
2. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```
3. Install dependencies (if not already installed):
   ```
   npm install
   ```
4. Start the frontend server:
   ```
   npm start
   ```
   
   The frontend will start on port 3001 (http://localhost:3001) and automatically proxy API requests to the backend on port 3000.

### Playing the Game
1. Open your browser and go to http://localhost:3001
2. You should see the loading screen, followed by the game interface
3. The connection status should show "Connected to backend successfully!" in green

### Testing the Connection
To verify that the frontend can successfully connect to the backend:

1. Check the browser's developer console (F12) for any error messages
2. Verify that the game data loads correctly (recipes, ingredients, customers)
3. Test the backend endpoints directly:
   - Health check: http://localhost:3000/api/gamedata/health (should return "OK")
   - Game data: http://localhost:3000/api/gamedata (should return JSON with recipes and ingredients)

### Troubleshooting
- If you see "Connection failed! Backend server not responding.", make sure the backend server is running
- Check that ports 3000 (backend) and 3001 (frontend) are available
- Check the browser console for any error messages
- The backend health check endpoint is available at http://localhost:3000/api/gamedata/health