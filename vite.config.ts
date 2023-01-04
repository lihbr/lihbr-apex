import { resolve } from "node:path";

import { type Plugin, defineConfig } from "vite";
import { minify } from "html-minifier-terser";
import { globbySync } from "globby";

const minifyHTML = (): Plugin => {
	const minifyOptions = {
		collapseBooleanAttributes: true,
		collapseWhitespace: true,
		keepClosingSlash: true,
		minifyCSS: true,
		removeComments: true,
		removeRedundantAttributes: true,
		removeScriptTypeAttributes: true,
		removeStyleLinkTypeAttributes: true,
		useShortDoctype: true,
	};

	return {
		name: "minify-html",
		enforce: "post",
		generateBundle: async (_, outputBundle) => {
			for (const bundle of Object.values(outputBundle)) {
				if (
					bundle.type === "asset" &&
					typeof bundle.source === "string" &&
					/\.html$/.test(bundle.fileName)
				) {
					bundle.source = await minify(bundle.source, minifyOptions);
				}
			}
		},
	};
};

export default defineConfig({
	root: resolve(__dirname, "dist/11ty"),
	server: {
		port: 3000,
		proxy: {
			"^(\\/[\\w\\-]+)+(\\?[\\w\\-=&]+)?$": {
				target: `http://localhost:${
					process.argv[2] === "preview" ? 5000 : 3000
				}`,
				rewrite: (path) => `${path.split("?").shift()}.html`,
			},
		},
		hmr: false,
	},
	build: {
		cssCodeSplit: false,
		emptyOutDir: true,
		outDir: resolve(__dirname, "dist/vite"),
		rollupOptions: {
			input: globbySync(["dist/11ty/**/*.html"]).map((path) =>
				resolve(__dirname, path),
			),
			output: {
				entryFileNames: "assets/js/[name].js",
				chunkFileNames: "assets/js/[name].js",
				assetFileNames: (assetInfo) => {
					const extension = assetInfo.name?.split(".").pop();

					switch (extension) {
						case "css":
							return "assets/css/[name][extname]";

						case "woff":
						case "woff2":
							return "assets/fonts/[name][extname]";

						default:
							return "assets/[name][extname]";
					}
				},
			},
		},
	},
	plugins: [minifyHTML()],
});
