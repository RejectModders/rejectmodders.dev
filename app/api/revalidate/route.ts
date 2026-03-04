import { NextRequest, NextResponse } from "next/server"
import { revalidateTag, revalidatePath } from "next/cache"

// List of paths that can be revalidated from the browser
const REVALIDATABLE_PATHS = [
  "/",
  "/about",
  "/friends",
  "/projects",
  "/games",
  "/spotify",
  "/api/github",
  "/api/github/stats",
  "/api/github/activity",
]

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET

// Helper function to verify authentication token
function verifyToken(request: NextRequest, body?: { token?: string }): boolean {
  if (!REVALIDATE_SECRET) {
    console.warn("REVALIDATE_SECRET is not set in environment variables")
    return false
  }

  // Check Authorization header first
  const authHeader = request.headers.get("authorization") || ""
  const headerToken = authHeader.replace("Bearer ", "")
  if (headerToken && headerToken === REVALIDATE_SECRET) {
    return true
  }

  // Check query parameter
  const queryToken = request.nextUrl.searchParams.get("token")
  if (queryToken && queryToken === REVALIDATE_SECRET) {
    return true
  }

  // Check body (for POST requests)
  if (body?.token && body.token === REVALIDATE_SECRET) {
    return true
  }

  return false
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))

  // Verify token first
  if (!verifyToken(request, body)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized - invalid or missing token" },
      { status: 401 }
    )
  }

  const { path } = body

  // If path is "all", revalidate all paths
  if (path === "all" || path === "/all") {
    try {
      // Revalidate all known paths
      for (const p of REVALIDATABLE_PATHS) {
        revalidatePath(p, "layout")
      }
      return NextResponse.json(
        { success: true, message: "All caches revalidated", paths: REVALIDATABLE_PATHS },
        { status: 200 }
      )
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Failed to revalidate cache", details: String(error) },
        { status: 500 }
      )
    }
  }

  // If specific path is provided
  if (path && typeof path === "string") {
    // Check if path is in the revalidatable list
    if (!REVALIDATABLE_PATHS.includes(path)) {
      return NextResponse.json(
        {
          success: false,
          error: `Path "${path}" is not in the revalidatable paths list`,
          available_paths: REVALIDATABLE_PATHS,
        },
        { status: 403 }
      )
    }

    try {
      revalidatePath(path, "layout")
      return NextResponse.json(
        { success: true, message: `Cache revalidated for path: ${path}`, path },
        { status: 200 }
      )
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Failed to revalidate cache", details: String(error) },
        { status: 500 }
      )
    }
  }

  // No path provided
  return NextResponse.json(
    {
      success: false,
      error: "No path provided",
      usage: {
        single_path: 'POST /api/revalidate with Authorization: Bearer YOUR_TOKEN and body: { "path": "/about" }',
        all_paths: 'POST /api/revalidate with Authorization: Bearer YOUR_TOKEN and body: { "path": "all" }',
        available_paths: REVALIDATABLE_PATHS,
      },
    },
    { status: 400 }
  )
}

export async function GET(request: NextRequest) {
  // Verify token first
  if (!verifyToken(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized - invalid or missing token" },
      { status: 401 }
    )
  }

  const path = request.nextUrl.searchParams.get("path")

  if (path === "all") {
    try {
      for (const p of REVALIDATABLE_PATHS) {
        revalidatePath(p, "layout")
      }
      return NextResponse.json(
        { success: true, message: "All caches revalidated", paths: REVALIDATABLE_PATHS },
        { status: 200 }
      )
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Failed to revalidate cache", details: String(error) },
        { status: 500 }
      )
    }
  }

  if (path) {
    if (!REVALIDATABLE_PATHS.includes(path)) {
      return NextResponse.json(
        {
          success: false,
          error: `Path "${path}" is not in the revalidatable paths list`,
          available_paths: REVALIDATABLE_PATHS,
        },
        { status: 403 }
      )
    }

    try {
      revalidatePath(path, "layout")
      return NextResponse.json(
        { success: true, message: `Cache revalidated for path: ${path}`, path },
        { status: 200 }
      )
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Failed to revalidate cache", details: String(error) },
        { status: 500 }
      )
    }
  }

  return NextResponse.json(
    {
      success: false,
      error: "No path provided",
      usage: {
        single_path: 'GET /api/revalidate?path=/about',
        all_paths: 'GET /api/revalidate?path=all',
        available_paths: REVALIDATABLE_PATHS,
      },
    },
    { status: 400 }
  )
}

