const cache = require("@11ty/eleventy-cache-assets");

const DISCOGS_API = "https://api.discogs.com";

const getCollection = async (user, key, secret, page = 1) => {
	const result = await cache(
		`${DISCOGS_API}/users/${user}/collection/folders/0/releases?key=${key}&secret=${secret}&sort=added&sort_order=desc&per_page=500&page=${page}`,
		{
			duration: "1d",
			type: "json",
			fetchOptions: {
				headers: {
					"user-agent": "lihbrApex/0.1 +https://lihbr.com",
				},
			},
		},
	);

	if (result.pagination.page < result.pagination.pages) {
		return [
			...result.releases,
			...(await getCollection(user, key, secret, page + 1)),
		];
	} else {
		return result.releases;
	}
};

const pluginDiscogs = (
	eleventyConfig,
	{ user, key, secret, namespace = "discogs" },
) => {
	const discogsCollection = getCollection(user, key, secret);

	eleventyConfig.addGlobalData(namespace, () => discogsCollection);
};
exports.pluginDiscogs = pluginDiscogs;
