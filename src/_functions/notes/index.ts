// @ts-expect-error 11ty doesn't provide TypeScript definitions
import { EleventyServerless } from "@11ty/eleventy";
import { Handler } from "@netlify/functions";

import "./eleventy-bundler-modules.js";

export const handler: Handler = async (event) => {
	console.log(event);

	const elev = new EleventyServerless("notes", {
		path: new URL(event.rawUrl).pathname,
		query: event.queryStringParameters,
		functionsDir: "src/_functions",
	});

	try {
		const [page] = await elev.getOutput();

		return {
			statusCode: 200,
			headers: {
				"Content-Type": "text/html; charset=UTF-8",
			},
			body: page.content,
		};
	} catch (error) {
		return {
			statusCode:
				error instanceof Error && "httpStatusCode" in error
					? (error as Error & { httpStatusCode: number }).httpStatusCode
					: 500,
			body: JSON.stringify({
				error: error instanceof Error ? error.message : "",
			}),
		};
	}
};
