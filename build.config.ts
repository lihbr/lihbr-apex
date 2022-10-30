import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
	entries: ["./src/_11ty/index"],
	outDir: "./dist/helpers",
	declaration: true,
	rollup: {
		emitCJS: true,
	},
});
