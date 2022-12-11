import { resolve } from "node:path";

import { defineConfig } from "vite";
import { minifyHtml } from "vite-plugin-html";
import globby from "globby";

export default defineConfig({
	root: resolve(__dirname, "dist/11ty"),
	server: {
		port: 3000,
		proxy: {
			"^(\\/[\\w\\-]+)+$": {
				target: `http://localhost:${
					process.argv[2] === "preview" ? 5000 : 3000
				}`,
				rewrite: (path) => `${path}.html`,
			},
		},
		hmr: false,
	},
	build: {
		cssCodeSplit: false,
		emptyOutDir: true,
		outDir: resolve(__dirname, "dist/vite"),
		rollupOptions: {
			input: globby
				.sync(["dist/11ty/**/*.html"])
				.map((path) => resolve(__dirname, path)),
			output: {
				entryFileNames: "assets/js/[name].js",
				chunkFileNames: "assets/js/[name].js",
				assetFileNames: (assetInfo) => {
					if (assetInfo.name) {
						if (assetInfo.name.endsWith(".css")) {
							return "assets/css/[name][extname]";
						}

						/**
						 * @see https://regex101.com/r/XHrc5v/1
						 */
						const maybeFont = assetInfo.name
							.replaceAll("\\", "/")
							.match(/\/(?<family>[\w-]+)\/(?<weight>\d{3}i?)\.woff2?/i);
						if (maybeFont && maybeFont.groups && maybeFont.groups.family) {
							return `assets/fonts/${maybeFont.groups.family}/[name][extname]`;
						}
					}

					return "assets/[name][extname]";
				},
			},
		},
	},
	plugins: [minifyHtml()],
});
