// Local development keepalive service
// This monitors and auto-starts local backend if it goes down

const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

const BACKEND_PORT = 3000;
const FRONTEND_PORT = 3001;
const CHECK_INTERVAL = 30000; // Check every 30 seconds

let backendProcess = null;
let frontendProcess = null;

function checkService(port, serviceName) {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port: port,
            path: serviceName === 'backend' ? '/actuator/health' : '/',
            timeout: 5000
        }, (res) => {
            resolve(true);
        });

        req.on('error', () => {
            resolve(false);
        });

        req.on('timeout', () => {
            req.destroy();
            resolve(false);
        });

        req.end();
    });
}

function startBackend() {
    if (backendProcess) {
        console.log('Backend process already exists, killing it first...');
        backendProcess.kill();
    }

    console.log('🚀 Starting backend server...');
    const backendDir = path.join(__dirname, 'backend');
    
    backendProcess = spawn('cmd', ['/c', 'mvnw.cmd', 'spring-boot:run'], {
        cwd: backendDir,
        detached: false,
        stdio: ['ignore', 'pipe', 'pipe']
    });

    backendProcess.stdout.on('data', (data) => {
        console.log(`Backend: ${data.toString().trim()}`);
    });

    backendProcess.stderr.on('data', (data) => {
        console.error(`Backend Error: ${data.toString().trim()}`);
    });

    backendProcess.on('close', (code) => {
        console.log(`Backend process exited with code ${code}`);
        backendProcess = null;
    });
}

function startFrontend() {
    if (frontendProcess) {
        console.log('Frontend process already exists, killing it first...');
        frontendProcess.kill();
    }

    console.log('🌐 Starting frontend server...');
    const frontendDir = path.join(__dirname, 'frontend');
    
    frontendProcess = spawn('node', ['server.js'], {
        cwd: frontendDir,
        detached: false,
        stdio: ['ignore', 'pipe', 'pipe']
    });

    frontendProcess.stdout.on('data', (data) => {
        console.log(`Frontend: ${data.toString().trim()}`);
    });

    frontendProcess.stderr.on('data', (data) => {
        console.error(`Frontend Error: ${data.toString().trim()}`);
    });

    frontendProcess.on('close', (code) => {
        console.log(`Frontend process exited with code ${code}`);
        frontendProcess = null;
    });
}

async function monitorServices() {
    console.log('🔍 Checking services...');
    
    const backendRunning = await checkService(BACKEND_PORT, 'backend');
    const frontendRunning = await checkService(FRONTEND_PORT, 'frontend');

    if (!backendRunning) {
        console.log('❌ Backend is down, restarting...');
        startBackend();
    } else {
        console.log('✅ Backend is running');
    }

    if (!frontendRunning) {
        console.log('❌ Frontend is down, restarting...');
        startFrontend();
    } else {
        console.log('✅ Frontend is running');
    }
}

// Initial start
console.log('🎮 Starting Cooking Game Local Keepalive Service');
console.log('📡 Will monitor and restart services automatically');

// Start both services initially
startBackend();
setTimeout(() => {
    startFrontend();
}, 10000); // Wait 10 seconds for backend to start

// Monitor every 30 seconds
setInterval(monitorServices, CHECK_INTERVAL);

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('🛑 Shutting down keepalive service...');
    if (backendProcess) backendProcess.kill();
    if (frontendProcess) frontendProcess.kill();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('🛑 Shutting down keepalive service...');
    if (backendProcess) backendProcess.kill();
    if (frontendProcess) frontendProcess.kill();
    process.exit(0);
});
