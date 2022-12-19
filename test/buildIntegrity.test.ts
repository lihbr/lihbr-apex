import { it, expect } from "vitest";

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

it("builds exist", () => {
	expect(existsSync(eleventyOutputPath)).toBe(true);
	expect(existsSync(viteOutputPath)).toBe(true);
});

it("builds output same pages", () => {
	expect(eleventyPagesGlob.length).toBeGreaterThan(0);
	expect(vitePagesGlob.length).toBe(eleventyPagesGlob.length);
});

it("builds output canonical links", async () => {
	const extractCanonicalFromPage = (content: string): string | undefined => {
		return content.match(
			/<link rel=(?<quoteType0>['"\b])?canonical\k<quoteType0> href=(?<quoteType1>['"\b])?(?<href>[/\w.:-]+)\k<quoteType1>/,
		)?.groups?.href;
	};

	const vitePages = (await readAllFiles(vitePagesGlob, viteOutputPath)).map(
		({ content }) => content.toString(),
	);

	const canonicals = vitePages
		.map(extractCanonicalFromPage)
		.filter(Boolean)
		.filter((href, index, arr) => arr.indexOf(href) === index)
		.sort();

	expect(canonicals.length).toBeGreaterThan(0);
	expect(canonicals.length).toBe(vitePagesGlob.length);
});

it("builds reference same script modules", async () => {
	/**
	 * Extracts sources of script modules from an HTML string
	 */
	const extractSourcesFromPage = (content: string): string[] => {
		const matches: string[] = [];

		/** @see regex101 @link{https://regex101.com/r/fR5vWO/1} */
		const regex = new RegExp(
			/<script[^>]*?(?<type>type=(?<quoteType>['"\b])?module\k<quoteType>)[^>]*>/gim,
		);
		let match;
		while ((match = regex.exec(content))) {
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
	).map(({ content }) => content.toString());
	const eleventyScripts = eleventyPages.map(extractSourcesFromPage);

	const vitePages = (await readAllFiles(vitePagesGlob, viteOutputPath)).map(
		({ content }) => content.toString(),
	);
	const viteScripts = vitePages.map(extractSourcesFromPage);

	expect(viteScripts).toStrictEqual(eleventyScripts);
});

it("builds preserve same font assets structure", async () => {
	const eleventyFontsGlob = globby.sync(["**/*.{woff,woff2}"], {
		cwd: eleventyOutputPath,
	});
	const viteFontsGlob = globby.sync(["**/*.{woff,woff2}"], {
		cwd: viteOutputPath,
	});

	expect(eleventyFontsGlob).toMatchInlineSnapshot(`
		[
		  "assets/fonts/cascadia-400.woff",
		  "assets/fonts/cascadia-400.woff2",
		  "assets/fonts/graphit-100.woff",
		  "assets/fonts/graphit-100.woff2",
		  "assets/fonts/graphit-100i.woff",
		  "assets/fonts/graphit-100i.woff2",
		  "assets/fonts/graphit-300.woff",
		  "assets/fonts/graphit-300.woff2",
		  "assets/fonts/graphit-300i.woff",
		  "assets/fonts/graphit-300i.woff2",
		  "assets/fonts/graphit-400.woff",
		  "assets/fonts/graphit-400.woff2",
		  "assets/fonts/graphit-400i.woff",
		  "assets/fonts/graphit-400i.woff2",
		  "assets/fonts/graphit-500.woff",
		  "assets/fonts/graphit-500.woff2",
		  "assets/fonts/graphit-500i.woff",
		  "assets/fonts/graphit-500i.woff2",
		  "assets/fonts/graphit-700.woff",
		  "assets/fonts/graphit-700.woff2",
		  "assets/fonts/graphit-700i.woff",
		  "assets/fonts/graphit-700i.woff2",
		  "assets/fonts/graphit-900.woff",
		  "assets/fonts/graphit-900.woff2",
		  "assets/fonts/virgil-400.woff",
		  "assets/fonts/virgil-400.woff2",
		]
	`);
	expect(viteFontsGlob).toStrictEqual(eleventyFontsGlob);
});
