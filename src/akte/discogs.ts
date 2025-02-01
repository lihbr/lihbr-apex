import type { DiscogsRelease } from "./types"

import fs from "node:fs/promises"
import path from "node:path"
import process from "node:process"

// @ts-expect-error 11ty doesn't provide TypeScript definitions
import eleventyFetch from "@11ty/eleventy-fetch"

const DISCOGS_API = "https://api.discogs.com"
const FALLBACK_JSON_DUMP = "https://lihbr.com/records.json"

async function getAllReleases(page = 1): Promise<DiscogsRelease[]> {
	const result = await eleventyFetch(
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

export async function getAllReleasesSafely(): Promise<DiscogsRelease[]> {
	let releases: DiscogsRelease[]

	try {
		releases = await getAllReleases()
	} catch {
		(async () => {
			try {
				await fetch(process.env.SLACK_NETLIFY_WEBHOOK!, {
					headers: { "content-type": "application/json" },
					method: "POST",
					body: JSON.stringify({
						text: "Used fallback JSON dump for Discogs releases",
						blocks: [
							{
								type: "section",
								text: {
									type: "mrkdwn",
									text: ":warning: Used fallback JSON dump for Discogs releases",
								},
							},
						],
					}),
				})
			} catch {
				// Noop
			}
		})()

		const result = await fetch(FALLBACK_JSON_DUMP)

		if (!result.ok) {
			throw new Error(`Failed to fetch fallback releases: ${result.statusText}`)
		}

		releases = await result.json()
	}

	if (process.env.NODE_ENV === "production") {
		await fs.writeFile(path.join(__dirname, "../public/records.json"), JSON.stringify(releases))
	}

	return releases
}
