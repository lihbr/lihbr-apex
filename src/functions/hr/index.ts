import type { Handler } from "@netlify/functions"

const JSON_HEADERS = {
	"content-type": "application/json",
}

const COLORS = [
	"#54669c",
	"#a54a5e",
	"#e84311",
	"#f27502",
	"#ffb005",
	"#759f53",
]

export const handler: Handler = async (event) => {
	if (event.httpMethod.toUpperCase() !== "GET") {
		return {
			statusCode: 400,
			// Netlify is not really helpful with its Handler type here...
			headers: { ...JSON_HEADERS } as Record<string, string>,
			body: JSON.stringify({ error: "Bad Request" }),
		}
	}

	return {
		statusCode: 200,
		headers: {
			"content-type": "image/svg+xml",
			"cache-control": "public, max-age=60, must-revalidate",
		},
		body: /* html */ `<svg width="128" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="128" height="16" fill="${COLORS[Math.floor(Math.random() * COLORS.length)]}"/></svg>`,
	}
}
