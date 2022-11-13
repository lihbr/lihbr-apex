const concurrently = require("concurrently");

const run = async () => {
	// Environment variables used on each command
	const env = {
		NODE_ENV: "production",
		DEBUG_COLORS: "true",
	};

	// Commands to run
	const commands = [];

	// Fonts
	commands.push({
		command: ["npm run fonts:decrypt"],
		name: "fonts",
		prefixColor: "red",
	});

	// unbuild
	commands.push({
		command: ["unbuild"],
		name: "helpers",
		prefixColor: "yellow",
	});

	// 11ty
	commands.push({
		command: ["eleventy"],
		name: "11ty",
		prefixColor: "gray",
	});

	// Vite
	commands.push({
		command: ["vite build"],
		name: "vite",
		prefixColor: "blueBright",
		env: {
			DEBUG: undefined,
		},
	});

	// AVA integrity check
	commands.push({
		command: ["vitest run buildIntegrity"],
		name: "integrity",
		prefixColor: "magentaBright",
	});

	// Launch processes
	for (let i = 0; i < commands.length; i++) {
		const command = commands[i];
		const { result } = concurrently([
			{
				...command,
				command: command.command.join(" "),
				env: { ...env, ...command.env },
			},
		]);

		await result;
	}
};

run();