#!/usr/bin/env node

// Simple deployment test script for the Cooking Game
const https = require('https');
const http = require('http');

// Configuration - Update these URLs to match your deployment
const BACKEND_URL = process.env.BACKEND_URL || 'https://cooking-game-backend.onrender.com';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://cooking-game-frontend.onrender.com';

console.log('=== Cooking Game Deployment Test ===\n');

console.log(`Testing backend at: ${BACKEND_URL}`);
console.log(`Testing frontend at: ${FRONTEND_URL}\n`);

// Test backend health endpoint
function testBackendHealth() {
  return new Promise((resolve, reject) => {
    const url = `${BACKEND_URL}/actuator/health`;
    console.log(`Testing backend health endpoint: ${url}`);
    
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      method: 'GET',
      timeout: 10000
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✓ Backend health check: OK');
          resolve({ status: 'success', data: data });
        } else {
          console.log(`✗ Backend health check failed with status: ${res.statusCode}`);
          reject(new Error(`Status code: ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', (e) => {
      console.log(`✗ Backend health check failed with error: ${e.message}`);
      reject(e);
    });
    
    req.on('timeout', () => {
      console.log('✗ Backend health check timed out');
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

// Test backend gamedata endpoint
function testBackendGameData() {
  return new Promise((resolve, reject) => {
    const url = `${BACKEND_URL}/api/gamedata`;
    console.log(`\nTesting backend gamedata endpoint: ${url}`);
    
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      method: 'GET',
      timeout: 10000
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            if (jsonData.recipes && jsonData.ingredients && jsonData.customers) {
              console.log('✓ Backend gamedata endpoint: OK');
              resolve({ status: 'success', data: jsonData });
            } else {
              console.log('✗ Backend gamedata endpoint: Invalid response structure');
              reject(new Error('Invalid response structure'));
            }
          } catch (e) {
            console.log('✗ Backend gamedata endpoint: Invalid JSON response');
            reject(new Error('Invalid JSON response'));
          }
        } else {
          console.log(`✗ Backend gamedata endpoint failed with status: ${res.statusCode}`);
          reject(new Error(`Status code: ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', (e) => {
      console.log(`✗ Backend gamedata endpoint failed with error: ${e.message}`);
      reject(e);
    });
    
    req.on('timeout', () => {
      console.log('✗ Backend gamedata endpoint timed out');
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

// Test frontend root endpoint
function testFrontendRoot() {
  return new Promise((resolve, reject) => {
    const url = `${FRONTEND_URL}/`;
    console.log(`\nTesting frontend root endpoint: ${url}`);
    
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      method: 'GET',
      timeout: 10000
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          if (data.includes('<!DOCTYPE html>') || data.includes('<html')) {
            console.log('✓ Frontend root endpoint: OK');
            resolve({ status: 'success' });
          } else {
            console.log('✗ Frontend root endpoint: Invalid HTML response');
            reject(new Error('Invalid HTML response'));
          }
        } else {
          console.log(`✗ Frontend root endpoint failed with status: ${res.statusCode}`);
          reject(new Error(`Status code: ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', (e) => {
      console.log(`✗ Frontend root endpoint failed with error: ${e.message}`);
      reject(e);
    });
    
    req.on('timeout', () => {
      console.log('✗ Frontend root endpoint timed out');
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

// Run all tests
async function runTests() {
  try {
    await testBackendHealth();
    await testBackendGameData();
    await testFrontendRoot();
    
    console.log('\n=== All tests passed! Your deployment is working correctly. ===');
    console.log('\nNext steps:');
    console.log('1. Visit your frontend URL in a browser');
    console.log('2. You should see the Cooking Game loading screen');
    console.log('3. After a few seconds, the game interface should appear');
    console.log('4. The connection status should show "Connected to backend successfully!" in green');
  } catch (error) {
    console.log('\n=== Tests failed! Please check your deployment configuration. ===');
    console.log('\nCommon issues and solutions:');
    console.log('1. Backend not responding:');
    console.log('   - Check that the backend service is deployed and running');
    console.log('   - Check the backend logs for errors');
    console.log('2. Frontend cannot connect to backend:');
    console.log('   - Check that BACKEND_URL environment variable is set correctly in the frontend');
    console.log('   - Check that the backend allows CORS from your frontend URL');
    console.log('3. Game data not loading:');
    console.log('   - Check that the backend /api/gamedata endpoint returns valid JSON');
    console.log('\nFor detailed deployment instructions, see DEPLOYMENT.md');
  }
}

// Run the tests
runTests();