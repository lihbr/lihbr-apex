import test from "ava";

import { resolve } from "node:path";
import { existsSync } from "node:fs";
import globby from "globby";

import { readAllFiles } from "./__testutils__/readAllFiles";

// Paths
const eleventyOutputPath = resolve(__dirname, "../dist/11ty");
const viteOutputPath = resolve(__dirname, "../dist/vite");

// Globs
const eleventyPagesGlob = globby.sync(["**/*.html"], {
	cwd: eleventyOutputPath,
});
const vitePagesGlob = globby.sync(["**/*.html"], { cwd: viteOutputPath });

test("builds exist", (t) => {
	t.true(existsSync(eleventyOutputPath));
	t.true(existsSync(viteOutputPath));
});

test("builds output same pages", (t) => {
	t.true(eleventyPagesGlob.length > 0);
	t.deepEqual(vitePagesGlob.length, eleventyPagesGlob.length);
});

test("builds reference same script modules", async (t) => {
	/**
	 * Extracts sources of script modules from an HTML string
	 */
	const extractSources = (page: string): string[] => {
		const matches: string[] = [];

		/** @see regex101 @link{https://regex101.com/r/fR5vWO/1} */
		const regex = new RegExp(
			/<script[^>]*?(?<type>type=(?<quoteType>['"\b])?module\k<quoteType>)[^>]*>/gim,
		);
		let match;
		while ((match = regex.exec(page))) {
			matches.push(match[0]);
		}

		return matches
			.map((match) => {
				return match.match(
					/** @see regex101 @link{https://regex101.com/r/t5iTUq/1} */
					/src=(?<quoteType>['"\b])?(?<src>[/\w.-]+)\k<quoteType>/im,
				)?.groups?.src;
			})
			.filter((match, index): match is string => {
				if (typeof match !== "string") {
					console.warn(`Unexpected script tag missing \`${matches[index]}\``);

					return false;
				} else if (match.match(/___base\.[jt]s/)) {
					return false;
				}

				return true;
			})
			.map((match) => match.replace(/\.[jt]s$/, ""));
	};

	const eleventyPages = (
		await readAllFiles(eleventyPagesGlob, eleventyOutputPath)
	).map((file) => file.toString());
	const eleventyScripts = eleventyPages.map(extractSources);

	const vitePages = (await readAllFiles(vitePagesGlob, viteOutputPath)).map(
		(file) => file.toString(),
	);
	const viteScripts = vitePages.map(extractSources);

	t.deepEqual(viteScripts, eleventyScripts);
});
