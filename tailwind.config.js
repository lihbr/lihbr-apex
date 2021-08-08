const Color = require("color");
const alpha = (hexa, alpha = 1) => Color(hexa).alpha(alpha).rgb().toString();

module.exports = {
	mode: "jit",
	prefix: "",
	important: false,
	separator: ":",
	purge: ["./src/**/*.njk"],
	darkMode: "class",
	theme: {
		fontFamily: {
			sans: [
				"Niveau Grotesk",
				"Roboto",
				"-apple-system",
				"BlinkMacSystemFont",
				'"Segoe UI"',
				"Helvetica",
				"Arial",
				"sans-serif",
				'"Apple Color Emoji"',
				'"Segoe UI Emoji"',
				'"Segoe UI Symbol"',
			],
			mono: [
				"SFMono-Regular",
				"Menlo",
				"Consolas",
				'"Liberation Mono"',
				"Courier",
				"monospace",
			],
		},
		colors: {
			transparent: "transparent",
			current: "currentColor",
			inherit: "inherit",
			slate: {
				DEFAULT: "#1e1919", // 800
				900: "#131010",
				700: "#292222",
				600: "#342b2b",
				100: "#6a5959",
				50: "#806b6b",
			},
			cream: {
				DEFAULT: "#fff7f7", // 800
				900: "#fffefe",
				700: "#ffe9e9",
				600: "#ffdbdb",
				100: "#ff9595",
				50: "#ff8787",
			},
			// o-20 used for tap highlight and inline code only
			navy: {
				DEFAULT: "#54669c",
				"o-20": alpha("#54669c", 0.2),
				100: "#7284ba",
			},
			beet: {
				DEFAULT: "#a54a5e",
				"o-20": alpha("#a54a5e", 0.2),
				100: "#c3687c",
			},
			flamingo: {
				DEFAULT: "#e84311",
				"o-20": alpha("#e84311", 0.2),
				100: "#ff6129",
			},
			ochre: {
				DEFAULT: "#f27502",
				"o-20": alpha("#f27502", 0.2),
				100: "#ff9320",
			},
			butter: {
				DEFAULT: "#ffb005",
				"o-20": alpha("#ffb005", 0.2),
				100: "#ffce23",
			},
			mantis: {
				DEFAULT: "#759f53",
				"o-20": alpha("#759f53", 0.2),
				100: "#93bd71",
			},
		},
		extend: {
			opacity: {
				inherit: "inherit",
			},
			spacing: {
				inherit: "inherit",
			},
			minWidth: {
				inherit: "inherit",
			},
			maxWidth: {
				inherit: "inherit",
			},
			minHeight: {
				inherit: "inherit",
			},
			maxHeight: {
				inherit: "inherit",
			},
			lineHeight: {
				0: 0,
			},
		},
	},
	plugins: [
		({ addBase, theme }) => {
			addBase({
				strong: { fontWeight: theme("fontWeight.bold") },
				"label, input, textarea, select": {
					display: "block",
					fontWeight: "inherit",
					fontStyle: "inherit",
				},
			});
		},
	],
};
