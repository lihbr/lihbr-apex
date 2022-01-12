const concurrently = require("concurrently");

const run = async () => {
	// Environment variables used on each command
	const env = {
		NODE_ENV: "development",
		DEBUG_COLORS: "true",
	};

	// Commands to run
	const commands = [];

	// 11ty
	commands.push({
		command: ["eleventy", "--watch"],
		name: "11ty",
		prefixColor: "gray",
	});

	// Postcss
	commands.push({
		command: [
			`chokidar "./src/**/*.njk" "./src/**/*.css" "./tailwind.config.js"`,
			`--command "${[
				"postcss src/_assets/css/style.css",
				"--output dist/assets/css/style.min.css",
				"--no-map",
				"--map",
				"--verbose",
			].join(" ")}"`,
			"--initial",
			"--silent",
		],
		name: "postcss",
		prefixColor: "redBright",
		env: {
			DEBUG: undefined,
		},
	});

	// BrowserSync
	commands.push({
		command: [
			"browser-sync start",
			"--server dist",
			"--extensions html",
			"--port 3000",
			"--watch",
			"--ignore node_modules",
			"--no-ui",
			"--no-open",
			"--no-notify",
			"--no-ghost-mode",
			"--index index.html",
		],
		name: "browserSync",
		prefixColor: "blueBright",
	});

	// Launch processes
	await concurrently(
		commands.map((command) => ({
			...command,
			command: command.command.join(" "),
			env: { ...env, ...command.env },
		})),
		{},
	);
};

run();
