import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
	entries: ["./src/_11ty/index"],
	outDir: "./dist/helpers",
	declaration: true,
	externals: ["@prismicio/types"],
	rollup: {
		emitCJS: true,
	},
});
