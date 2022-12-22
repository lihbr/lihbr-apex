// @ts-expect-error 11ty doesn't provide TypeScript definitions
import fetch from "@11ty/eleventy-fetch";

import type { EleventyConfig } from "../types";

export const DISCOGS_API = "https://api.discogs.com";

export type DiscogsPluginOptions = {
	user: string;
	key: string;
	secret: string;
	namespace?: string;
};

const getCollection = async (
	user: string,
	key: string,
	secret: string,
	page = 1,
): Promise<unknown[]> => {
	const result = await fetch(
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

export const pluginDiscogs = (
	eleventyConfig: EleventyConfig,
	{ user, key, secret, namespace = "discogs" }: DiscogsPluginOptions,
): void => {
	const discogsCollection = getCollection(user, key, secret);

	eleventyConfig.addGlobalData(namespace, () => discogsCollection);
};
