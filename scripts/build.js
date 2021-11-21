const concurrently = require("concurrently");

const run = async () => {
	// Environment variables used on each command
	const env = {
		NODE_ENV: "production",
		DEBUG_COLORS: "true",
	};

	// Commands to run
	const commands = [];

	// 11ty
	commands.push({
		command: ["eleventy"],
		name: "11ty",
		prefixColor: "gray",
	});

	// Postcss
	commands.push({
		command: [
			"postcss src/_assets/css/style.css",
			"--output dist/assets/css/style.min.css",
			"--no-map",
			"--map",
		],
		name: "postcss",
		prefixColor: "redBright",
		env: {
			DEBUG: undefined,
		},
	});

	// Launch processes
	for (let i = 0; i < commands.length; i++) {
		const command = commands[i];
		await concurrently(
			[
				{
					...command,
					command: command.command.join(" "),
					env: { ...env, ...command.env },
				},
			],
			{},
		);
	}
};

run();
