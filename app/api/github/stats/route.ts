import { NextResponse } from "next/server"
import { GITHUB_USERNAME, GITHUB_API_URL, CACHE_DURATION_API, CACHE_DURATION_API_STALE } from "@/config/constants"

export const revalidate = 600 // 10 minutes

const ORGS = ["disutils", "vulnradar"]

export async function GET() {
  try {
    const headers = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    }
    const opts = { headers, next: { revalidate: CACHE_DURATION_API, tags: ["github-stats"] } }

    const [user, userRepos, ...orgRepos] = await Promise.all([
      fetch(`${GITHUB_API_URL}/users/${GITHUB_USERNAME}`, opts).then(r => r.json()),
      fetch(`${GITHUB_API_URL}/users/${GITHUB_USERNAME}/repos?per_page=100&type=public`, opts).then(r => r.json()),
      ...ORGS.map(org =>
        fetch(`${GITHUB_API_URL}/orgs/${org}/repos?per_page=100`, opts).then(r => r.json())
      ),
    ])

    const allRepos = [
      ...(Array.isArray(userRepos) ? userRepos : []),
      ...orgRepos.flatMap(r => Array.isArray(r) ? r : []),
    ]

    const seen = new Set<number>()
    const stars = allRepos
      .filter(r => { if (seen.has(r.id)) return false; seen.add(r.id); return true })
      .reduce((acc: number, r: { stargazers_count?: number }) => acc + (r.stargazers_count ?? 0), 0)

    return NextResponse.json(
      { public_repos: user.public_repos ?? 0, followers: user.followers ?? 0, stars },
      { headers: { "Cache-Control": `public, s-maxage=${CACHE_DURATION_API}, stale-while-revalidate=${CACHE_DURATION_API_STALE}` } }
    )
  } catch {
    return NextResponse.json({ public_repos: 0, followers: 0, stars: 0 }, { status: 500 })
  }
}

