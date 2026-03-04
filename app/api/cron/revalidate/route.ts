import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

// List of page paths that can be revalidated
// Note: API routes handle their own caching via 'export const revalidate = X'
// and Cache-Control headers, so they don't need revalidatePath()
const REVALIDATABLE_PATHS = [
  '/',
  '/about',
  '/friends',
  '/projects',
  '/games',
  '/spotify',
]

// API routes to revalidate
const REVALIDATABLE_API_ROUTES = [
  '/api/github',
  '/api/github/stats',
  '/api/github/activity',
  '/api/avatar',
  '/api/status',
]

export async function POST() {
  const timestamp = new Date().toISOString()

  try {
    console.log(`\n[Cache Clear] [${timestamp}] Starting cache revalidation...`)

    // Revalidate all page paths
    for (const path of REVALIDATABLE_PATHS) {
      revalidatePath(path, 'layout')
    }

    // Revalidate all API routes
    for (const path of REVALIDATABLE_API_ROUTES) {
      revalidatePath(path, 'layout')
    }

    const totalPaths = REVALIDATABLE_PATHS.length + REVALIDATABLE_API_ROUTES.length
    console.log(`[Cache Clear] [${timestamp}] Cache revalidated for ${totalPaths} paths`)

    console.log(`[Cache Clear] [${timestamp}] Pages:`)
    REVALIDATABLE_PATHS.forEach((path) => {
      console.log(`   - ${path}`)
    })

    console.log(`[Cache Clear] [${timestamp}] API Routes:`)
    REVALIDATABLE_API_ROUTES.forEach((path) => {
      console.log(`   - ${path}`)
    })

    return NextResponse.json(
      {
        success: true,
        message: `Cache revalidated for ${totalPaths} paths`,
        pages: REVALIDATABLE_PATHS,
        api_routes: REVALIDATABLE_API_ROUTES,
        timestamp,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(`[Cache Clear] [${timestamp}] Cache revalidation error:`, error)
    return NextResponse.json(
      {
        success: false,
        message: 'Cache revalidation failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp,
      },
      { status: 500 }
    )
  }
}

