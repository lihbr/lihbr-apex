import type { EleventyConfig } from "../types";

export type NetlifyPluginOptions = {
	namespace?: string;
};

export const pluginNetlify = (
	eleventyConfig: EleventyConfig,
	{ namespace = "netlify" }: NetlifyPluginOptions,
): void => {
	const commitRef = process.env.COMMIT_REF || "unknown";
	const repositoryURL = process.env.REPOSITORY_URL || "https://example.com/dev";

	eleventyConfig.addGlobalData(namespace, () => {
		return {
			commitRef,
			commitRefShort: commitRef.slice(0, 7),
			commitURL: `${repositoryURL}/commit/${commitRef}`,
			repositoryURL,
			buildTime: Date.now(),
		};
	});
};
