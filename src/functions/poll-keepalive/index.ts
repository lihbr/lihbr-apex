import type { Handler } from "@netlify/functions"

import process from "node:process"

const JSON_HEADERS = {
	"content-type": "application/json",
}

function upstash(endpoint: string, body?: string): Promise<Response> {
	const url = new URL(endpoint, process.env.UPSTASH_ENDPOINT!)

	const method = body ? "POST" : "GET"
	const headers: Record<string, string> = body ? { ...JSON_HEADERS } : {}
	headers.authorization = `Bearer ${process.env.UPSTASH_TOKEN}`

	return fetch(url.toString(), {
		body,
		method,
		headers,
	})
}

export const handler: Handler = async (event) => {
	if (event.httpMethod.toUpperCase() !== "POST") {
		return {
			statusCode: 400,
			headers: { ...JSON_HEADERS },
			body: JSON.stringify({ error: "Bad Request" }),
		}
	}

	await upstash(`./set/ping/${Date.now()}`)

	const res = await upstash(`./get/ping`)
	const json = await res.json()

	if (
		!res.ok ||
		typeof json !== "object" ||
		!json ||
		!("result" in json) ||
		!Array.isArray(json.result)
	) {
		throw new Error(JSON.stringify(json))
	}

	await fetch(process.env.SLACK_NETLIFY_WEBHOOK!, {
		headers: { ...JSON_HEADERS },
		method: "POST",
		body: JSON.stringify({
			text: "New keep alive report~",
			blocks: [{
				type: "section",
				text: {
					type: "mrkdwn",
					text: `:bouquet: Kept alive at: '${JSON.stringify(json.result)}'`,
				},
			}],
		}),
	})

	return {
		statusCode: 200,
		headers: { ...JSON_HEADERS },
		body: JSON.stringify({}),
	}
}
