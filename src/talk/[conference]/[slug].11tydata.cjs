const { logErrors } = require("../../../dist/helpers/index.cjs");
const globalComputed = require("../../_data/eleventyComputed.cjs");

module.exports = {
	eleventyComputed: {
		...globalComputed,
		meta: logErrors((data) => {
			if (Object.keys(data).length === 0) {
				return {};
			}

			return globalComputed.meta({
				...data,
				meta: {
					title: data.talk.title,
					description: `Resources from my talk during ${data.talk.conference.name}`,
				},
			});
		}),
	},
};
