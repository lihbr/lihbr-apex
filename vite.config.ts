import { resolve } from "node:path";
import { defineConfig } from "vite";
import { minifyHtml } from "vite-plugin-html";
import globby from "globby";

export default defineConfig({
	root: resolve(__dirname, "dist/11ty"),
	server: {
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
		outDir: resolve(__dirname, "dist/vite"),
		emptyOutDir: true,
		rollupOptions: {
			input: globby
				.sync(["dist/11ty/**/*.html"])
				.map((path) => resolve(__dirname, path)),
			output: {
				entryFileNames: "assets/js/[name].js",
				chunkFileNames: "assets/js/[name].js",
				assetFileNames: (assetInfo) => {
					if (assetInfo.name?.endsWith(".css")) {
						return "assets/css/[name][extname]";
					} else {
						return "assets/[name][extname]";
					}
				},
			},
		},
	},
	plugins: [minifyHtml()],
});
