module.exports = {
	plugins: {
		"postcss-import": {},
		tailwindcss: {},
		autoprefixer: process.env.NODE_ENV === "production" ? {} : false,
		cssnano: process.env.NODE_ENV === "production" ? {} : false,
	},
};
