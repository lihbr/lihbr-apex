import { resolve } from "node:path";
import { existsSync } from "node:fs";

import { expect, it } from "vitest";
import { globbySync } from "globby";

import { readAllFiles } from "./__testutils__/readAllFiles";

// Paths
const akteOutputPath = resolve(__dirname, "../src/.akte/render");
const akteAssetsPath = resolve(__dirname, "../src/assets");

const viteOutputPath = resolve(__dirname, "../dist");
const viteAssetsPath = resolve(__dirname, "../dist/assets");

// Globs
const aktePagesGlob = globbySync(["**/*.html"], { cwd: akteOutputPath });
const vitePagesGlob = globbySync(["**/*.html"], { cwd: viteOutputPath });

it("builds exist", () => {
	expect(existsSync(akteOutputPath)).toBe(true);
	expect(existsSync(viteOutputPath)).toBe(true);
});

it("builds output same pages", () => {
	expect(aktePagesGlob.length).toBeGreaterThan(0);
	expect(vitePagesGlob.length).toBe(aktePagesGlob.length);
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
		const regex =
			/<script[^>]*?(?<type>type=(?<quoteType>['"\b])?module\k<quoteType>)[^>]*>/gim;
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
				} else if (match.match(/_base\.[jt]s/)) {
					return false;
				}

				return true;
			})
			.map((match) => match.replace(/\.[jt]s$/, ""));
	};

	const aktePages = (await readAllFiles(aktePagesGlob, akteOutputPath)).map(
		({ content }) => content.toString(),
	);
	const akteScripts = aktePages.map(extractSourcesFromPage);

	const vitePages = (await readAllFiles(vitePagesGlob, viteOutputPath)).map(
		({ content }) => content.toString(),
	);
	const viteScripts = vitePages.map(extractSourcesFromPage);

	expect(viteScripts).toStrictEqual(akteScripts);
});

it("builds preserve same font assets structure", async () => {
	const akteFontsGlob = globbySync(["**/*.{woff,woff2}"], {
		cwd: akteAssetsPath,
	});
	const viteFontsGlob = globbySync(["**/*.{woff,woff2}"], {
		cwd: viteAssetsPath,
	});

	expect(akteFontsGlob).toMatchInlineSnapshot(`
		[
		  "fonts/cascadia-400.woff",
		  "fonts/cascadia-400.woff2",
		  "fonts/graphit-100.woff",
		  "fonts/graphit-100.woff2",
		  "fonts/graphit-100i.woff",
		  "fonts/graphit-100i.woff2",
		  "fonts/graphit-300.woff",
		  "fonts/graphit-300.woff2",
		  "fonts/graphit-300i.woff",
		  "fonts/graphit-300i.woff2",
		  "fonts/graphit-400.woff",
		  "fonts/graphit-400.woff2",
		  "fonts/graphit-400i.woff",
		  "fonts/graphit-400i.woff2",
		  "fonts/graphit-500.woff",
		  "fonts/graphit-500.woff2",
		  "fonts/graphit-500i.woff",
		  "fonts/graphit-500i.woff2",
		  "fonts/graphit-700.woff",
		  "fonts/graphit-700.woff2",
		  "fonts/graphit-700i.woff",
		  "fonts/graphit-700i.woff2",
		  "fonts/graphit-900.woff",
		  "fonts/graphit-900.woff2",
		  "fonts/virgil-400.woff",
		  "fonts/virgil-400.woff2",
		]
	`);
	expect(viteFontsGlob).toStrictEqual(akteFontsGlob);
});
