# VSCode Refresh Instructions

## Overview

This document provides instructions on how to ensure VSCode shows the updated files after making changes to the cooking-game project.

## Quick Solution

We've created a batch file that will refresh VSCode and open the key files:

1. Close VSCode if it's currently open
2. Run `refresh_vscode.bat` in the project root directory
3. VSCode will restart and open the key files with their latest changes

## Manual Steps

If the batch file doesn't work, try these manual steps:

### 1. Refresh VSCode

- **Option 1**: Press `F1` or `Ctrl+Shift+P` to open the command palette, then type "Reload Window" and select it
- **Option 2**: Close VSCode completely and reopen it

### 2. Run the Refresh Workspace Task

- Press `F1` or `Ctrl+Shift+P` to open the command palette
- Type "Tasks: Run Task" and select it
- Choose "Refresh Workspace" from the list

### 3. Check File Watcher Settings

We've updated your `.vscode/settings.json` with improved file watcher settings:

```json
"files.autoSave": "afterDelay",
"files.autoSaveDelay": 1000,
"files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/node_modules/*/**": true
},
"files.useExperimentalFileWatcher": true
```

### 4. Other Troubleshooting Tips

- Try making a small change to a file and saving it to force VSCode to refresh
- Check if the files are open in VSCode - if not, open them manually
- Verify that the files exist in the correct locations
- Try using the "Search" feature in VSCode to find and open the files

## Key Files

These are the key files that were modified:

1. `backend/src/main/resources/application.properties` - Updated backend port to 3000
2. `frontend/static/script.js` - Updated to use relative API paths
3. `frontend/static/index.html` - Updated to use relative paths for assets
4. `frontend/server.js` - Re-enabled proxy functionality

## Running the Application

We've also created VSCode tasks to help run the application:

1. Press `F1` or `Ctrl+Shift+P` to open the command palette
2. Type "Tasks: Run Task" and select it
3. Choose "Start Application" to run both the backend and frontend servers

Alternatively, you can start them individually:
- Choose "Start Backend" to run the backend server first (runs on port 3000)
- Then choose "Start Frontend" to run the frontend server (runs on port 3001)

The backend will be available at http://localhost:3000, and the frontend will be available at http://localhost:3001. The frontend server will proxy API requests to the backend running on port 3000.