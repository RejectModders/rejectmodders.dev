#!/usr/bin/env node

/**
 * Cache Revalidation Script
 * Automatically revalidates all cached paths every 12 hours
 * Can also be run manually with: node scripts/revalidate-cache.js
 */

const https = require('https');
const http = require('http');

// Configuration
const API_URL = process.env.REVALIDATE_API_URL || 'http://localhost:3000';
const REVALIDATE_INTERVAL = process.env.REVALIDATE_INTERVAL || 12 * 60 * 60 * 1000; // 12 hours
const CRON_SECRET = process.env.CRON_SECRET || 'internal-cron-job';

// Helper function to make HTTP request
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data),
            headers: res.headers,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers,
          });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Function to revalidate all caches
async function revalidateAllCaches() {
  const timestamp = new Date().toISOString();
  console.log(`\n🔄 [${timestamp}] Starting cache revalidation...`);

  try {
    const url = `${API_URL}/api/cron/revalidate`;

    const response = await makeRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Cron-Secret': CRON_SECRET,
      },
    });

    if (response.status === 200 && response.data.success) {
      console.log(`✅ [${timestamp}] Cache revalidation successful!`);
      console.log(`   Revalidated ${response.data.paths.length} paths:`);
      response.data.paths.forEach((path) => {
        console.log(`   - ${path}`);
      });
      return true;
    } else {
      console.error(`❌ [${timestamp}] Cache revalidation failed with status ${response.status}`);
      console.error(`   Response:`, response.data);
      return false;
    }
  } catch (error) {
    console.error(`❌ [${timestamp}] Error during cache revalidation:`, error.message);
    return false;
  }
}

// Main function to run on interval
async function startCronTask() {
  console.log('🚀 Cache Revalidation Cron Task Started');
  console.log(`📅 Interval: Every ${REVALIDATE_INTERVAL / (60 * 60 * 1000)} hours`);
  console.log(`🔗 API URL: ${API_URL}`);
  console.log('');

  // Run immediately on start
  await revalidateAllCaches();

  // Then run on interval
  setInterval(async () => {
    await revalidateAllCaches();
  }, REVALIDATE_INTERVAL);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down cache revalidation cron task...');
  process.exit(0);
});

// Start the cron task
startCronTask().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});


