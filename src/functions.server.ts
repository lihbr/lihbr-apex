import type { Handler, HandlerContext, HandlerEvent } from "@netlify/functions"
import {
	appendResponseHeaders,
	createApp,
	createRouter,
	defineEventHandler,
	getHeaders,
	getQuery,
	getRequestURL,
	readRawBody,
	sendRedirect,
	setResponseStatus,
} from "h3"

import { handler as admin } from "./functions/admin"
import { handler as hr } from "./functions/hr"
import { handler as poll } from "./functions/poll"
import { handler as pollKeepalive } from "./functions/poll-keepalive"
import { handler as preview } from "./functions/preview"

import "dotenv/config"

const app = createApp()
const router = createRouter()
app.use(router)

function serve(handler: Handler) {
	return defineEventHandler(async (event) => {
		const url = getRequestURL(event)
		const headers = getHeaders(event)
		const rawQuery = getQuery(event)
		const [query, multiQuery] = Object.entries(rawQuery).reduce<[Record<string, string>, Record<string, string[]>]>((acc, [key, value]) => {
			if (Array.isArray(value)) {
				acc[1][key] = value.map((v) => `${v}`)
			} else {
				acc[0][key] = `${value}`
			}

			return acc
		}, [{}, {}])
		const body = event.method !== "GET" ? await readRawBody(event) ?? null : null

		const netlifyEvent: HandlerEvent = {
			rawUrl: url.toString(),
			rawQuery: url.search,
			path: url.pathname,
			httpMethod: event.method,
			headers,
			multiValueHeaders: {},
			queryStringParameters: query,
			multiValueQueryStringParameters: multiQuery,
			body,
			isBase64Encoded: false,
		}

		const response = await handler(netlifyEvent, {} as HandlerContext)

		if (response) {
			appendResponseHeaders(event, response.headers ?? {})
			setResponseStatus(event, response.statusCode ?? 200)

			if (response.headers?.location) {
				return sendRedirect(event, response.headers?.location as string, response.statusCode)
			}
			return response.body || ""
		}
	})
}

router.use("/admin", serve(admin))
router.use("/api/hr", serve(hr))
router.use("/api/poll", serve(poll))
router.use("/api/poll-keepalive", serve(pollKeepalive))
router.use("/preview", serve(preview))
router.use("/preview/**", serve(preview))

export { app }
