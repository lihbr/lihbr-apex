module.exports = {
	plugins: {
		"postcss-import": {},
		"tailwindcss/nesting": require("postcss-nesting"),
		tailwindcss: {},
		autoprefixer: process.env.NODE_ENV === "production" ? {} : false,
		cssnano: process.env.NODE_ENV === "production" ? {} : false,
	},
};
