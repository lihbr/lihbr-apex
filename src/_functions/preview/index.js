import { prismicPreview } from "eleventy-plugin-prismic";

// @ts-expect-error no TypeScript definitions
import { prismicPluginOptions } from "./eleventy.config.js";

import "./eleventy-bundler-modules.js";

export const handler = async (event) => {
	// Set APP_URL dynamically
	if (process.env.AWS_LAMBDA_FUNCTION_NAME && event.headers.host) {
		process.env.APP_URL = `https://${event.headers.host}`;
	}

	// const response = await prismicPreview.handle(
	// 	event.path,
	// 	event.queryStringParameters,
	// 	event.headers,
	// 	prismicPluginOptions,
	// );

	const path = event.path;
	const query = event.queryStringParameters;
	const headers = event.headers;
	const options = prismicPluginOptions;

	const response =
			(await prismicPreview.resolve(query, options)) ||
			(await prismicPreview.get(path, query, headers, options));



	delete process.env.APP_URL;

	return {
		...response,
		headers: {
			...response.headers,
			"X-Robots-Tag": "noindex, nofollow",
		},
	};

	return response;
};
