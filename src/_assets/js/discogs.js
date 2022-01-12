const nodeFetch = require("node-fetch");

const DISCOGS_API = "https://api.discogs.com";

const getCollection = async (user, key, secret, page = 1) => {
	const response = await nodeFetch(
		`${DISCOGS_API}/users/${user}/collection/folders/0/releases?key=${key}&secret=${secret}&sort=added&sort_order=desc&per_page=500&page=${page}`,
		{
			headers: {
				"user-agent": "lihbrApex/0.1 +https://lihbr.com",
			},
		},
	);
	const json = await response.json();

	if (json.pagination.page < json.pagination.pages) {
		return [
			...json.releases,
			...(await getCollection(user, key, secret, page + 1)),
		];
	} else {
		return json.releases;
	}
};
exports.getCollection = getCollection;
