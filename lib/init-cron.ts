// Server-side initialization for cron jobs
// This module runs once when the server starts

import { startCacheRevalidationCron } from './cache-revalidation'

// Flag to ensure we only initialize once per server instance
let initialized = false

/**
 * Initialize all server-side cron jobs
 * This function is called once when the application starts
 */
async function initializeCronJobs() {
  // Check if already initialized - prevents multiple initializations
  if (initialized) {
    return
  }

  // Set flag immediately to prevent race conditions
  initialized = true

  console.log("[Init] Initializing cron jobs...")

  try {
    // Start the cache revalidation cron
    await startCacheRevalidationCron()
  } catch (error) {
    console.error('[Init] Error initializing cron jobs:', error)
  }
}

// Initialize immediately when this module is loaded on server startup
// Only runs once because of the initialized flag
initializeCronJobs().catch((error) => {
  console.error('[Init] Failed to initialize cron jobs:', error)
})

