import type { Handler } from "@netlify/functions"

import process from "node:process"

import { RateLimiter } from "../../akte/lib/RateLimiter"
import { isBlacklisted } from "./isBlacklisted"

const JSON_HEADERS = {
	"content-type": "application/json",
}

const rateLimiter = new RateLimiter({
	cache: new Map(),
	options: { limit: 6, window: 3_600_000 },
})

export const handler: Handler = async (event) => {
	if (event.httpMethod.toUpperCase() !== "POST") {
		return {
			statusCode: 400,
			headers: { ...JSON_HEADERS },
			body: JSON.stringify({ error: "Bad Request" }),
		}
	}

	const usage = rateLimiter.trackUsage(event)

	if (usage.hasReachedLimit) {
		return {
			statusCode: 429,
			headers: { ...JSON_HEADERS, ...usage.headers },
			body: JSON.stringify({ error: "Too Many Requests" }),
		}
	}

	const body = Object.fromEntries(
		new URLSearchParams(event.body || "").entries(),
	)

	const errors: string[] = []
	if (!("from" in body)) {
		errors.push("`from` is missing in body")
	} else {
		if (body.from.length > 256) {
			errors.push("`from` cannot be longer than 256 characters")
		}
		if (body.from.split("@").length !== 2) {
			errors.push("`from` must be a valid email")
		}
		if (isBlacklisted(body.from)) {
			// kthxbye
			return {
				statusCode: 302,
				headers: { location: "/contact/thanks", ...usage.headers },
			}
		}
	}

	if (!("message" in body)) {
		errors.push("`message` is missing in body")
	} else {
		if (body.message.length < 7) {
			errors.push("`message` cannot be short than 7 characters")
		} else if (body.message.length > 2048) {
			errors.push("`from` cannot be longer than 2048 characters")
		}
	}

	if (errors.length) {
		return {
			statusCode: 400,
			headers: { ...JSON_HEADERS, ...usage.headers },
			body: JSON.stringify({
				error: "Bad Request",
				message: errors.join(", "),
			}),
		}
	}

	if ("notARobot" in body && body.notARobot === "on") {
		// kthxbye
		return {
			statusCode: 302,
			headers: { location: "/contact/thanks", ...usage.headers },
		}
	}

	const blocks = [
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: ":mailbox: New contact message received~",
			},
		},
		{
			type: "divider",
		},
		{
			type: "section",
			fields: [
				{
					type: "mrkdwn",
					text: "*From:*",
				},
				{
					type: "plain_text",
					text: body.from,
					emoji: true,
				},
			],
		},
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: "*Message:*",
			},
		},
		{
			type: "section",
			text: {
				type: "plain_text",
				text: body.message,
				emoji: true,
			},
		},
	]

	await fetch(process.env.SLACK_CONTACT_WEBHOOK!, {
		headers: { ...JSON_HEADERS },
		method: "POST",
		body: JSON.stringify({
			text: "New contact message received~",
			blocks,
		}),
	})

	return {
		statusCode: 302,
		headers: { location: "/contact/thanks", ...usage.headers },
	}
}
