import type { Handler, HandlerEvent } from "@netlify/functions"

import { Buffer } from "node:buffer"
import process from "node:process"

import { RateLimiter } from "../../akte/lib/RateLimiter"
import { sha256 } from "../../akte/sha256"
import { app } from "./admin.akte.app"

const JSON_HEADERS = {
	"content-type": "application/json",
}

const HTML_HEADERS = {
	"content-type": "text/html; charset=utf-8",
}

// const SESSION_NAME = "lihbr-session" as const
// const SESSION_EXPIRY = 3_600_000
// const ACTIVE_SESSIONS: Map<string, number> = new Map()

const rateLimiter = new RateLimiter({
	cache: new Map(),
	options: { limit: 6, window: 3_600_000 },
})

async function authenticate(event: HandlerEvent): Promise<{ session: string } | false> {
	if (!event.headers.authorization) {
		// const cookies = cookie.parse(event.headers.cookie || "")

		// const expiresAt = ACTIVE_SESSIONS.get(cookies[SESSION_NAME])
		// if (expiresAt) {
		// 	if (expiresAt > Date.now()) {
		// 		return { session: cookies[SESSION_NAME] }
		// 	}

		// 	ACTIVE_SESSIONS.delete(cookies[SESSION_NAME])
		// }

		return false
	}

	const [username, password] = Buffer.from(
		event.headers.authorization.split(" ").pop()!,
		"base64",
	).toString().split(":")

	const credentials = `${username}:${await sha256(password, process.env.PRISMIC_TOKEN!)}`
	if (credentials === process.env.APP_ADMIN_CREDENTIALS) {
		const session = await sha256(credentials, `${process.env.PRISMIC_TOKEN}:${Date.now()}`)
		// ACTIVE_SESSIONS.set(session, Date.now() + SESSION_EXPIRY)

		return { session }
	}

	return false
}

export const handler: Handler = async (event) => {
	if (event.httpMethod.toUpperCase() !== "GET") {
		return {
			statusCode: 400,
			headers: { ...JSON_HEADERS },
			body: JSON.stringify({ error: "Bad Request" }),
		}
	}

	const user = await authenticate(event)
	if (!user) {
		const usage = rateLimiter.trackUsage(event)

		if (usage.hasReachedLimit) {
			return {
				statusCode: 429,
				headers: { ...JSON_HEADERS, ...usage.headers },
				body: JSON.stringify({ error: "Too Many Requests" }),
			}
		}

		return {
			statusCode: 401,
			headers: {
				...HTML_HEADERS,
				"www-authenticate": "Basic realm=\"Access to the admin area\"",
			},
			body: await app.render(app.lookup("/404")),
		}
	}

	// const url = getSiteURL()
	// const cookies = cookie.serialize(SESSION_NAME, user.session, {
	// 	domain: url.startsWith("https://") ? url.replace(/^(https:\/\/)/, "").replace(/\/$/, "") : undefined,
	// 	path: "/admin",
	// 	expires: new Date(ACTIVE_SESSIONS.get(user.session)!),
	// 	httpOnly: true,
	// 	secure: url.startsWith("https://"),
	// 	sameSite: "strict",
	// })

	return {
		statusCode: 200,
		headers: { ...HTML_HEADERS },
		body: await app.render(app.lookup("/admin")),
	}
}
