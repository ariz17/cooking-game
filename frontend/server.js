const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001; // Use a different port for the frontend server

const STATIC_DIR = path.join(__dirname, 'static');
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mov': 'video/quicktime',
  '.mp4': 'video/mp4'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Check if this is an API request that should be proxied
  if (req.url.startsWith('/api')) {
    console.log(`Proxying request to backend: ${req.url}`);

    // Forward the request to the backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    // Parse the backend URL
    const backendUrlObj = new URL(backendUrl);
    const options = {
      hostname: backendUrlObj.hostname,
      port: backendUrlObj.port || (backendUrlObj.protocol === 'https:' ? 443 : 80),
      path: req.url,
      method: req.method,
      headers: req.headers
    };

    // Use https module for HTTPS requests
    const requestModule = backendUrlObj.protocol === 'https:' ? require('https') : http;
    
    const proxyReq = requestModule.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy error:', err);
      res.writeHead(500);
      res.end('Proxy error: ' + err.message);
    });

    // Handle request body if present
    req.pipe(proxyReq);

    return;
  }

  // Handle static files
  let filePath = STATIC_DIR;
  if (req.url === '/' || req.url.split('?')[0] === '/') {
    filePath = path.join(STATIC_DIR, 'index.html');
  } else {
    // Remove query parameters for file path resolution
    const urlPath = req.url.split('?')[0];

    // Decode URI components to handle spaces and special characters
    const decodedPath = decodeURIComponent(urlPath);
    filePath = path.join(STATIC_DIR, decodedPath);
  }

  const extname = path.extname(filePath).toLowerCase();
  console.log(`File extension: ${extname} for path: ${filePath}`);
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  console.log(`Content type: ${contentType} for file: ${filePath}`);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.log(`File not found: ${filePath}`);
        // File not found, serve index.html for SPA routing
        fs.readFile(path.join(STATIC_DIR, 'index.html'), (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end('Error loading index.html');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          }
        });
      } else {
        // Server error
        console.log(`Server error: ${err.code} for file: ${filePath}`);
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success
      console.log(`Successfully serving file: ${filePath} with content type: ${contentType}`);
      res.writeHead(200, { 'Content-Type': contentType });

      // For binary files like videos and images, don't use utf-8 encoding
      if (contentType.startsWith('video/') || contentType.startsWith('image/')) {
        res.end(content);
      } else {
        res.end(content, 'utf-8');
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
  console.log(`API requests will be proxied to: ${process.env.BACKEND_URL || 'http://localhost:3000'}`);
});