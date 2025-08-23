# Running the Cooking Game Locally

This document explains how to run the Cooking Game application locally.

## Prerequisites

- Java 17 or higher
- Node.js 14 or higher
- Maven (included with the project)

## Running the Application

### Option 1: Using the Start Script (Windows only)

Double-click on `start-servers.bat` to start both the backend and frontend servers.

### Option 2: Manual Start

1. Start the backend server:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

2. In a separate terminal, start the frontend server:
   ```bash
   cd frontend
   node server.js
   ```

### Option 3: Using Docker (if available)

If you have Docker installed, you can use docker-compose (if available) to run both services.

## Accessing the Application

Once both servers are running:

- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api/gamedata

## Troubleshooting

### Backend server not starting

Make sure you're in the backend directory and have Java 17+ installed.

### Frontend not connecting to backend

1. Ensure both servers are running
2. Check that the backend is accessible at http://localhost:3000
3. Check that the frontend is accessible at http://localhost:3001

### Images not loading

The customer images are served by the frontend server. Make sure the frontend server is running and the image files are in the `frontend/static/assets` directory.