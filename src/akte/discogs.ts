import type { DiscogsRelease } from "./types"

import process from "node:process"

// @ts-expect-error 11ty doesn't provide TypeScript definitions
import fetch from "@11ty/eleventy-fetch"

const DISCOGS_API = "https://api.discogs.com"

export async function getAllReleases(page = 1): Promise<DiscogsRelease[]> {
	const result = await fetch(
		`${DISCOGS_API}/users/${process.env.DISCOGS_USER}/collection/folders/0/releases?key=${process.env.DISCOGS_KEY}&secret=${process.env.DISCOGS_SECRET}&sort=added&sort_order=desc&per_page=500&page=${page}`,
		{
			duration: "1d",
			type: "json",
			fetchOptions: {
				headers: {
					"user-agent": "lihbrApex/0.1 +https://lihbr.com",
				},
			},
		},
	)

	if (result.pagination.page < result.pagination.pages) {
		return [...result.releases, ...(await getAllReleases(page + 1))]
	} else {
		return result.releases
	}
}
