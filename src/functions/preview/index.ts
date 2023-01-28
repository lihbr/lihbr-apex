import type { Handler } from "@netlify/functions";

import { get, resolve } from "./prismicPreview";

const JSON_HEADERS = {
	"content-type": "application/json",
};

export const handler: Handler = async (event) => {
	if (event.httpMethod.toUpperCase() !== "GET") {
		return {
			statusCode: 400,
			headers: { ...JSON_HEADERS },
			body: JSON.stringify({ error: "Bad Request" }),
		};
	}

	// Set APP_URL dynamically
	if (process.env.AWS_LAMBDA_FUNCTION_NAME && event.headers.host) {
		process.env.APP_URL = `https://${event.headers.host}`;
	}

	return (await resolve(event)) || (await get(event));
};
