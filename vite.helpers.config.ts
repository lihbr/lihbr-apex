import { defineConfig } from "vite";
import sdk from "vite-plugin-sdk";

export default defineConfig({
	build: {
		lib: {
			entry: "./src/_helpers/index.ts",
		},
		outDir: "./dist/helpers",
	},
	plugins: [sdk({ srcDir: "src/_helpers" })],
});
