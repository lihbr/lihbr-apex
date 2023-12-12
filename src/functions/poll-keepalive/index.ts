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

	await upstash(`./set/ping/${Date.now()}`);

	const res = await upstash(`./get/ping`);
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

	return {
		statusCode: 200,
		headers: { ...JSON_HEADERS },
		body: JSON.stringify({}),
	};
};
