const { prismicPreview } = require("eleventy-plugin-prismic");

const { prismicPluginOptions } = require("./eleventy.config.js");

require("./eleventy-bundler-modules.js");

const handler = async (event) => {
	// Set APP_URL dynamically
	if (process.env.AWS_LAMBDA_FUNCTION_NAME && event.headers?.host) {
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

exports.handler = handler;
