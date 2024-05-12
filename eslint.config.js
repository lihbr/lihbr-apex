import antfu from "@antfu/eslint-config";

export default antfu({
	stylistic: {
		quotes: "double",
		indent: "tab",
		semi: true,
		overrides: {
			"style/arrow-parens": ["error", "always"],
			"style/brace-style": ["error", "1tbs"],
			"style/operator-linebreak": [
				"error",
				"after",
				{ overrides: { "?": "before", ":": "before" } },
			],
			"curly": ["error", "all"],
			"ts/consistent-type-definitions": ["error", "type"],
			"ts/explicit-module-boundary-types": "error",
		},
	},
});
