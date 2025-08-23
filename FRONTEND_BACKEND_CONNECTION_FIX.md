# Frontend-Backend Connection Fix

## Problem
Frontend shows "Failed to load game data. Please start the backend server" even though backend is running.

## Root Cause
The frontend's `BACKEND_URL` environment variable doesn't match your actual backend service URL on Render.

## Solution Steps

### Step 1: Find Your Actual Backend URL
1. Go to your Render dashboard
2. Click on your backend service (cooking-game-backend)
3. Copy the URL shown at the top (it will look like: `https://cooking-game-backend-xxxx.onrender.com`)

### Step 2: Update Frontend Environment Variable
1. Go to your frontend service in Render dashboard
2. Click "Settings" tab
3. Scroll to "Environment Variables" section
4. Update the `BACKEND_URL` variable with your actual backend URL from Step 1
5. Click "Save Changes"

### Step 3: Alternative - Manual Redeploy
If the environment variable update doesn't trigger a redeploy:
1. Go to your frontend service
2. Click "Manual Deploy" → "Deploy latest commit"

## Testing the Fix

### Test Backend Endpoints Directly
Replace `YOUR_BACKEND_URL` with your actual backend URL:

1. **Health Check**: `https://YOUR_BACKEND_URL/actuator/health`
   - Should return: `{"status":"UP"}`

2. **API Data**: `https://YOUR_BACKEND_URL/api/gamedata`
   - Should return JSON with recipes, ingredients, customers

3. **Root Path**: `https://YOUR_BACKEND_URL/`
   - Should show API documentation page

### Test Frontend Connection
1. Open browser developer tools (F12)
2. Go to your frontend URL
3. Enter name and select background
4. Check Console tab for any error messages
5. Check Network tab to see if API requests are being made

## Common Backend URLs on Render
Your backend URL might be one of these formats:
- `https://cooking-game-backend.onrender.com`
- `https://cooking-game-backend-xxxx.onrender.com` (where xxxx is random characters)

## If Still Not Working

### Check Frontend Logs
1. Go to frontend service in Render
2. Click "Logs" tab
3. Look for proxy errors or connection issues

### Check Backend Logs
1. Go to backend service in Render
2. Click "Logs" tab
3. Verify the service is receiving requests

### Manual Test
Open browser and try: `https://YOUR_FRONTEND_URL/api/gamedata`
- If this works, the proxy is working
- If this fails, there's a proxy configuration issue
