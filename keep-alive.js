// Keep-alive script to prevent Render services from sleeping
// This can be deployed on a separate free service or run locally

const https = require('https');
const http = require('http');

const BACKEND_URL = 'https://cooking-game-backend.onrender.com';
const FRONTEND_URL = 'https://cooking-game-frontend.onrender.com';

// Ping interval: every 10 minutes (600,000 ms)
const PING_INTERVAL = 10 * 60 * 1000;

function pingService(url, serviceName) {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (res) => {
        console.log(`✅ ${serviceName} pinged successfully - Status: ${res.statusCode}`);
    }).on('error', (err) => {
        console.log(`❌ Error pinging ${serviceName}:`, err.message);
    });
}

function startKeepAlive() {
    console.log('🚀 Starting keep-alive service...');
    console.log(`📡 Will ping services every ${PING_INTERVAL / 60000} minutes`);
    
    // Initial ping
    pingService(BACKEND_URL + '/actuator/health', 'Backend');
    pingService(FRONTEND_URL, 'Frontend');
    
    // Set up recurring pings
    setInterval(() => {
        pingService(BACKEND_URL + '/actuator/health', 'Backend');
        pingService(FRONTEND_URL, 'Frontend');
    }, PING_INTERVAL);
}

// Start the keep-alive service
startKeepAlive();

// Keep the process running
process.on('SIGINT', () => {
    console.log('🛑 Keep-alive service stopped');
    process.exit(0);
});
