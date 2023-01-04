import concurrently from "concurrently";

const run = async () => {
	// Environment variables used on each command
	const env = {
		NODE_ENV: "development",
		DEBUG_COLORS: "true",
	};

	// Commands to run
	const commands = [];

	// Helpers
	const { result: helpers } = concurrently(
		[
			{
				command: ["vite build", "--config vite.helpers.config.ts"].join(" "),
				name: "helpers",
				prefixColor: "yellow",
				env,
			},
		],
		{},
	);
	await helpers;

	// 11ty
	commands.push({
		command: ["eleventy", "--watch", "--config=eleventy.config.cjs"],
		name: "11ty",
		prefixColor: "gray",
	});

	// Vite
	commands.push({
		command: ["vite"],
		name: "vite",
		prefixColor: "blueBright",
		env: {
			DEBUG: undefined,
		},
	});

	// Launch processes
	const { result } = concurrently(
		commands.map((command) => ({
			...command,
			command: command.command.join(" "),
			env: { ...env, ...command.env },
		})),
		{},
	);

	await result;
};

run();
