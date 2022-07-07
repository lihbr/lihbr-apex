// @ts-expect-error 11ty doesn't provide TypeScript definitions
import _cache from "@11ty/eleventy-cache-assets";

import { Client } from "@notionhq/client";

import { htmlSerializer, AnyBlock } from "../notion";
import { EleventyConfig } from "../types";

export type NotionPluginOptions = {
	auth: string;
	namespace?: string;
};

export const pluginNotion = async (
	eleventyConfig: EleventyConfig,
	{ auth, namespace = "notion" }: NotionPluginOptions,
): Promise<void> => {
	const client = new Client({
		auth,
		// fetch: cache,
	});

	const foo = await client.databases.query({
		database_id: "6c4bbf6b14cd4059a85b5325131ae421",
		page_size: 100,
	});

	const bar = await client.blocks.children.list({
		block_id: "e9b7a9fe41dc4e82b7a4fefb138a3bb0",
	});

	console.log("");
	console.log(JSON.stringify(foo.results, null, 2));
	console.log("");
	// console.log(namespace);
	// console.log("");
	// console.log(htmlSerializer(bar.results));
	// console.log("");

	const notionCollection = [bar.results];

	eleventyConfig.addGlobalData(namespace, () => notionCollection);

	eleventyConfig.addShortcode("notion_asHTML", (blocks: AnyBlock[]) => {
		return htmlSerializer(blocks);
	});
};
