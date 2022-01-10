const { prismicPreview } = require("eleventy-plugin-prismic");

const { prismicPluginOptions } = require("./eleventy.config.js");

require("./eleventy-bundler-modules.js");

const handler = async (event) => {
	const tmp = await prismicPreview.handle(
		event.path,
		event.queryStringParameters,
		event.headers,
		prismicPluginOptions,
	);

	if (tmp.headers && tmp.headers.location) {
		return {
			...tmp,
			headers: {
				...tmp.headers,
				location: tmp.headers.location + "?preview=resolved",
			},
		};
	} else {
		return tmp;
	}
};

exports.handler = handler;
