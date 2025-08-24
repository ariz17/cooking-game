// Keep-alive web service to prevent Render services from sleeping
// This creates an HTTP server that also pings other services

const https = require('https');
const http = require('http');

const BACKEND_URL = 'https://cooking-game-backend.onrender.com';
const FRONTEND_URL = 'https://cooking-game-frontend.onrender.com';

// Ping interval: every 10 minutes (600,000 ms)
const PING_INTERVAL = 10 * 60 * 1000;

let pingCount = 0;
let lastPingTime = null;

function pingService(url, serviceName) {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (res) => {
        console.log(`✅ ${serviceName} pinged successfully - Status: ${res.statusCode}`);
        pingCount++;
        lastPingTime = new Date();
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

// Create HTTP server to satisfy Render's port requirement
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    
    if (req.url === '/status') {
        res.end(JSON.stringify({
            status: 'active',
            pingCount: pingCount,
            lastPingTime: lastPingTime,
            nextPingIn: `${PING_INTERVAL / 60000} minutes`,
            services: {
                backend: BACKEND_URL,
                frontend: FRONTEND_URL
            }
        }, null, 2));
    } else {
        res.end(JSON.stringify({
            message: 'Keep-alive service is running',
            status: 'active',
            endpoints: {
                status: '/status'
            }
        }, null, 2));
    }
});

// Start the keep-alive service
startKeepAlive();

// Start HTTP server on the port Render provides
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🌐 Keep-alive HTTP server running on port ${PORT}`);
    console.log(`📊 Status available at: /status`);
});

// Keep the process running
process.on('SIGINT', () => {
    console.log('🛑 Keep-alive service stopped');
    server.close();
    process.exit(0);
});
