import { prismicPreview } from "eleventy-plugin-prismic";

import { prismicPluginOptions } from "./eleventy.config.cjs";

export const handler = async (event) => {
	// Set APP_URL dynamically
	if (process.env.AWS_LAMBDA_FUNCTION_NAME && event.headers.host) {
		process.env.APP_URL = `https://${event.headers.host}`;
	}

	const response = await prismicPreview.handle(
		event.path,
		event.queryStringParameters,
		event.headers,
		prismicPluginOptions,
	);

	delete process.env.APP_URL;

	return response;
};
