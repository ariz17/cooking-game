# Cooking Game Deployment Guide

This guide will help you deploy the Cooking Game application to Render successfully. The application consists of two separate services:
1. Frontend (Node.js/Express static file server)
2. Backend (Spring Boot/Java API server)

## Prerequisites

1. A Render account (https://render.com)
2. A GitHub account with this repository forked/cloned
3. Basic understanding of Render deployment process

## Deployment Steps

### Step 1: Deploy Backend Service

1. Log in to your Render account
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service with these settings:
   - **Name**: cooking-game-backend (or any name you prefer)
   - **Root Directory**: `backend`
   - **Environment**: Docker
   - **Dockerfile Path**: `./Dockerfile` (should be auto-detected)
   - **Health Check Path**: `/actuator/health`
   - **Environment Variables**:
     - `SPRING_PROFILES_ACTIVE`: `prod`
5. Click "Create Web Service"
6. Wait for deployment to complete (may take 5-10 minutes)

### Step 2: Note Backend URL

After deployment completes, note the URL assigned to your backend service. It will look like:
`https://your-backend-name.onrender.com`

### Step 3: Deploy Frontend Service

1. Click "New" → "Web Service"
2. Connect the same GitHub repository
3. Configure the service with these settings:
   - **Name**: cooking-game-frontend (or any name you prefer)
   - **Root Directory**: `frontend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV`: `production`
     - `BACKEND_URL`: `[URL from Step 2]` (e.g., `https://your-backend-name.onrender.com`)
4. Click "Create Web Service"
5. Wait for deployment to complete

### Step 4: Update Backend Environment Variable (If needed)

If you need to update the backend URL in the frontend after deployment:

1. Go to your frontend service in Render
2. Click "Settings" tab
3. In the "Environment Variables" section, update:
   - `BACKEND_URL`: `[your backend URL]`
4. Click "Save Changes"
5. The service will automatically redeploy

## Troubleshooting Common Issues

### Issue 1: "Connection failed! Backend server not responding"

**Solution**: 
1. Ensure the backend service is deployed and running
2. Check that the `BACKEND_URL` environment variable in the frontend matches the actual backend URL
3. Check the backend logs for any errors

### Issue 2: CORS Errors

**Solution**:
The backend is configured to allow requests from any origin. If you experience CORS issues:
1. Check that the frontend is making requests to the correct backend URL
2. Check the browser console for specific CORS error messages

### Issue 3: Game Data Not Loading

**Solution**:
1. Check that the backend `/api/gamedata` endpoint returns JSON data
2. Check the browser console for JavaScript errors
3. Ensure the frontend is making requests to `/api/gamedata` (the proxy in server.js handles this)

## Environment Variables Reference

### Frontend Service
- `NODE_ENV`: `production` (sets the Node.js environment)
- `BACKEND_URL`: Backend service URL (e.g., `https://cooking-game-backend.onrender.com`)

### Backend Service
- `SPRING_PROFILES_ACTIVE`: `prod` (sets the Spring profile)
- `PORT`: `3000` (automatically set by Render, default is 3000)

## Testing Your Deployment

1. Visit your frontend URL (e.g., `https://cooking-game-frontend.onrender.com`)
2. You should see the loading screen, followed by the game interface
3. The connection status should show "Connected to backend successfully!" in green
4. Game data should load automatically

## Local Development

To run the application locally:

### Backend
```bash
cd backend
./mvnw spring-boot:run
```
The backend will start on port 3000.

### Frontend
```bash
cd frontend
npm install
node server.js
```
The frontend will start on port 3001.

## Notes

- The frontend automatically proxies API requests to the backend using the BACKEND_URL environment variable
- Customer images are now using relative paths, so they work in both local and deployed environments
- CORS is configured to allow requests from any origin for maximum compatibility