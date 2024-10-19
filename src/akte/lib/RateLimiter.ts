import type { HandlerEvent } from "@netlify/functions"

type RateLimitHeaders = {
	"x-ratelimit-limit": number
	"x-ratelimit-remaining": number
	"x-ratelimit-used": number
	"x-ratelimit-reset": number
}

type RateLimitConstructorArgs = {
	cache: Map<string, { used: number, reset: number }>
	options: { limit: number, window: number }
}

export class RateLimiter {
	cache: RateLimitConstructorArgs["cache"]
	options: RateLimitConstructorArgs["options"]

	constructor(args: RateLimitConstructorArgs) {
		this.cache = args.cache
		this.options = args.options
	}

	trackUsage(event: HandlerEvent): {
		headers: RateLimitHeaders
		hasReachedLimit: boolean
	} {
		const now = Date.now()

		// Identify consumer based on IP
		const consumerID = (
			event.headers["x-forwarded-for"] ||
			event.headers["x-nf-client-connection-ip"] ||
			event.headers["client-ip"] ||
			""
		).split(", ")[0]

		// Get consumer
		let consumerInfo = this.cache.get(consumerID)

		// If consumer is now OR reset window has been reached, create new window
		if (!consumerInfo || consumerInfo.reset < now) {
			consumerInfo = {
				used: 0,
				reset: now + this.options.window,
			}
		}

		// If consumer has reached the limit, return for 429
		if (consumerInfo.used >= this.options.limit) {
			return {
				headers: this._getHeadersForConsumer(consumerInfo),
				hasReachedLimit: true,
			}
		}

		// Else update consumer
		consumerInfo.used++
		this.cache.set(consumerID, consumerInfo)

		// And return
		return {
			headers: this._getHeadersForConsumer(consumerInfo),
			hasReachedLimit: false,
		}
	}

	private _getHeadersForConsumer(consumerInfo: {
		used: number
		reset: number
	}): RateLimitHeaders {
		return {
			"x-ratelimit-limit": this.options.limit,
			"x-ratelimit-remaining": this.options.limit - consumerInfo.used,
			"x-ratelimit-used": consumerInfo.used,
			"x-ratelimit-reset": consumerInfo.reset,
		}
	}
}
