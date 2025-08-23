# Running the Cooking Game Locally

This document explains how to run the Cooking Game application locally.

## Prerequisites

- Java 17 or higher
- Node.js 14 or higher
- Maven (included with the project)

## Running the Application

### Option 1: Using the Start Script (Windows only)

Double-click on `start-servers.bat` to start both the backend and frontend servers.

If you encounter any issues with the start script, try the manual start option below.

### Option 2: Manual Start

1. Start the backend server:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   On Windows:
   ```cmd
   cd backend
   mvnw.cmd spring-boot:run
   ```

2. In a separate terminal, start the frontend server:
   ```bash
   cd frontend
   node server.js
   ```

### Option 3: Using Docker (if available)

If you have Docker installed, you can use docker-compose (if available) to run both services.

## Troubleshooting

### Backend server not starting

Make sure you're in the backend directory and have Java 17+ installed.

### Frontend not connecting to backend

1. Ensure both servers are running
2. Check that the backend is accessible at http://localhost:3000
3. Check that the frontend is accessible at http://localhost:3001

### Images not loading

The customer images are served by the frontend server. Make sure the frontend server is running and the image files are in the `frontend/static/assets` directory.

### Health check endpoints

The backend now has two health check endpoints:
- http://localhost:3000/actuator/health (Spring Boot Actuator - for Render deployment)
- http://localhost:3000/api/gamedata/health (Custom endpoint - simple "OK" response)

### CORS Issues

When deploying to Render, make sure the frontend and backend URLs are correctly configured in the CORS configuration (CorsConfig.java). The current configuration allows requests from:
- http://localhost:3001 (for local development)
- https://cooking-game-frontend.onrender.com (for Render deployment)

If your Render URLs are different, update them in the CorsConfig.java file.

## Accessing the Application

Once both servers are running:

- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api/gamedata

Note: Accessing the backend root URL (http://localhost:3000/) will return a 404 error. This is expected behavior as the backend is a REST API service that only responds to specific endpoints like `/api/gamedata`.

## Troubleshooting

### Backend server not starting

Make sure you're in the backend directory and have Java 17+ installed.

### Frontend not connecting to backend

1. Ensure both servers are running
2. Check that the backend is accessible at http://localhost:3000
3. Check that the frontend is accessible at http://localhost:3001

### Images not loading

The customer images are served by the frontend server. Make sure the frontend server is running and the image files are in the `frontend/static/assets` directory.