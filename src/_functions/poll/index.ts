import type { Handler } from "@netlify/functions";
import fetch, { type Response } from "node-fetch";

const JSON_HEADERS = {
	"content-type": "application/json",
};

const upstash = (endpoint: string, body?: string): Promise<Response> => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const url = new URL(endpoint, process.env.UPSTASH_ENDPOINT!);

	const method = body ? "POST" : "GET";
	const headers: Record<string, string> = body ? { ...JSON_HEADERS } : {};
	headers.authorization = `Bearer ${process.env.UPSTASH_TOKEN}`;

	return fetch(url.toString(), {
		body,
		method,
		headers,
	});
};

export const handler: Handler = async (event) => {
	if (event.httpMethod.toUpperCase() !== "GET") {
		return {
			statusCode: 400,
			headers: { ...JSON_HEADERS },
			body: JSON.stringify({ error: "Bad Request" }),
		};
	}

	const body = event.queryStringParameters || {};

	const errors: string[] = [];
	if (!body.id) {
		errors.push("`id` is missing in body");
	} else if (body.id.length > 8) {
		errors.push("`id` cannot be longer than 8 characters");
	}

	if (body.vote && body.vote.length > 8) {
		errors.push("`vote` cannot be longer than 8 characters");
	}

	if (errors.length) {
		return {
			statusCode: 400,
			headers: { ...JSON_HEADERS },
			body: JSON.stringify({
				error: "Bad Request",
				message: errors.join(", "),
			}),
		};
	}

	if (body.vote) {
		try {
			const res = await upstash(
				"/",
				JSON.stringify([
					"EVAL",
					`
					local id = KEYS[1]
					local vote = ARGV[1]

					local r = redis.call("HINCRBY", id, vote, 1)

					local ttl = redis.call("TTL", id)
					if ttl == -1 then
						redis.call("EXPIRE", id, 3600)
					end

					return r
					`,
					1,
					body.id,
					body.vote,
				]),
			);

			if (!res.ok) {
				console.error(await res.json());
			}
		} catch (error) {
			console.error(error);
		}

		return {
			statusCode: 302,
			headers: { location: "/talks/poll" },
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any;
	}

	const res = await upstash(`./hgetall/${body.id}`);
	const json = await res.json();

	if (
		!res.ok ||
		typeof json !== "object" ||
		!json ||
		!("result" in json) ||
		!Array.isArray(json.result)
	) {
		throw new Error(JSON.stringify(json));
	}

	const results: Record<string, number> = {};
	for (let i = 0; i < json.result.length; i += 2) {
		results[json.result[i]] = parseInt(json.result[i + 1]);
	}

	return {
		statusCode: 200,
		headers: { ...JSON_HEADERS },
		body: JSON.stringify({
			id: body.id,
			results,
		}),
	};
};
