import { NextResponse } from "next/server"

// Cache activity for 5 minutes (300 seconds) for fresh activity updates
export const revalidate = 300

const USER = "RejectModders"
const INTERESTING = ["PushEvent", "CreateEvent", "PullRequestEvent", "IssuesEvent", "WatchEvent"]

export async function GET() {
  try {
    const res = await fetch(
      `https://api.github.com/users/${USER}/events/public?per_page=30`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        next: { revalidate: 300 },
      }
    )
    if (!res.ok) return NextResponse.json([], { status: res.status })
    const data = await res.json()
    const filtered = Array.isArray(data)
      ? data.filter((e: { type: string }) => INTERESTING.includes(e.type)).slice(0, 8)
      : []

    return NextResponse.json(filtered, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    })
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}

