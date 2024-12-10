const process = require("node:process")
const { farben, alpha } = require("@lihbr/farben")

const content = ["./src/**/*.ts"]

// Vite does not like it when we watch the `render` folder in development
if (process.env.NODE_ENV === "production") {
	content.push("./src/.akte/render/**/*.html")
} else {
	content.push("./src/.akte/data/**/*.data")
}

/** @type {import('tailwindcss').Config} */
module.exports = {
	prefix: "",
	important: false,
	separator: ":",
	content,
	darkMode: "class",
	theme: {
		fontFamily: {
			sans: [
				"Graphit",
				"\"Graphit CLS\"",
				"Roboto",
				"-apple-system",
				"BlinkMacSystemFont",
				"\"Segoe UI\"",
				"Helvetica",
				"Arial",
				"sans-serif",
				"\"Apple Color Emoji\"",
				"\"Segoe UI Emoji\"",
			],
			mono: [
				"Consolas",
				"SFMono-Regular",
				"\"SF Mono\"",
				"Menlo",
				"\"Liberation Mono\"",
				"monospace",
			],
		},
		colors: {
			transparent: "transparent",
			current: "currentColor",
			inherit: "inherit",
			theme: {
				"DEFAULT": "var(--color-theme)",
				"o-20": "var(--color-theme-o-20)",
				"100": "var(--color-theme-100)",
			},
			slate: {
				"DEFAULT": farben.slate[800], // 800
				"o-20": alpha(farben.slate[800], 0.2),
				"900": farben.slate[900],
				"700": farben.slate[700],
				"200": farben.slate[200],
				"100": farben.slate[100],
				"50": farben.slate[50],
			},
			cream: {
				"DEFAULT": farben.cream[800], // 800
				"o-20": alpha(farben.cream[800], 0.2),
				"900": farben.cream[900],
				"700": farben.cream[700],
				"200": farben.cream[200],
				"100": farben.cream[100],
				"50": farben.cream[50],
			},
			// o-20 used for tap highlight and inline code only
			navy: {
				"DEFAULT": farben.navy[400],
				"o-20": alpha(farben.navy[400], 0.2),
				"100": farben.navy[100],
			},
			beet: {
				"DEFAULT": farben.beet[400],
				"o-20": alpha(farben.beet[400], 0.2),
				"100": farben.beet[100],
			},
			flamingo: {
				"DEFAULT": farben.flamingo[400],
				"o-20": alpha(farben.flamingo[400], 0.2),
				"100": farben.flamingo[100],
			},
			ochre: {
				"DEFAULT": farben.ochre[400],
				"o-20": alpha(farben.ochre[400], 0.2),
				"100": farben.ochre[100],
			},
			butter: {
				"DEFAULT": farben.butter[400],
				"o-20": alpha(farben.butter[400], 0.2),
				"100": farben.butter[100],
			},
			mantis: {
				"DEFAULT": farben.mantis[400],
				"o-20": alpha(farben.mantis[400], 0.2),
				"100": farben.mantis[100],
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
			transitionDuration: {
				0: "0ms",
			},
		},
	},
	plugins: [
		({ addBase, addVariant, theme }) => {
			addBase({
				"strong": { fontWeight: theme("fontWeight.medium") },
				"small": { fontSize: "inherit" },
				"label, input, textarea, select": {
					display: "block",
					fontWeight: "inherit",
					fontStyle: "inherit",
				},
			})

			addVariant("hocus", ["&:hover", "&:focus"])
			addVariant("current", "&[aria-current=\"page\"]")
			addVariant("left", "html.left &")
			addVariant("center", "html.center &")
			addVariant("right", "html.right &")
			addVariant("open", "details[open] > summary &")
		},
	],
}
