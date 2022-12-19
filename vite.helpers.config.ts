import { defineConfig } from "vite";
import sdk from "vite-plugin-sdk";

export default defineConfig({
	build: {
		lib: {
			entry: "./src/_11ty/index.ts",
		},
		outDir: "./dist/helpers",
	},
	plugins: [sdk({ srcDir: "src/_11ty" })],
});
