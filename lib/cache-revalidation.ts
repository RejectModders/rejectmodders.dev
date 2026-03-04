let cronJobStarted = false

// Function to revalidate all caches by calling the API endpoint
async function revalidateAllCaches() {
  const timestamp = new Date().toISOString()
  console.log(`\n[Cache Clear] [${timestamp}] Triggering cache revalidation...`)

  try {
    // Call the revalidate API endpoint
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/cron/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`)
    }

    const data = await response.json()
    console.log(`[Cache Clear] [${timestamp}] Cache revalidation completed successfully`)
  } catch (error) {
    console.error(`[Cache Clear] [${timestamp}] Cache revalidation error:`, error)
  }
}

// Start the cron job
export async function startCacheRevalidationCron() {
  // Only start once
  if (cronJobStarted) {
    return
  }
  cronJobStarted = true

  console.log("[Cron] Cache Revalidation Task Started")
  console.log("[Cron] Interval: Every 12 hours")
  console.log("")

  // Run immediately on start
  await revalidateAllCaches()

  // Then run every 12 hours
  setInterval(async () => {
    await revalidateAllCaches()
  }, 12 * 60 * 60 * 1000)
}

