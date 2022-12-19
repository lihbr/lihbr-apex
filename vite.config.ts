import { resolve } from "node:path";

import { defineConfig } from "vite";
import { minifyHtml } from "vite-plugin-html";
import globby from "globby";

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
			input: globby
				.sync(["dist/11ty/**/*.html"])
				.map((path) => resolve(__dirname, path)),
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
							return `assets/fonts/[name][extname]`;

						default:
							return "assets/[name][extname]";
					}
				},
			},
		},
	},
	plugins: [minifyHtml()],
});
