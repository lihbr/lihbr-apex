// @ts-check
import lihbr from "@lihbr/eslint-config"

export default lihbr({
	vue: {
		overrides: {
			"vue/singleline-html-element-content-newline": ["error", {
				ignores: ["NuxtLink", "pre", "textarea", "span", "em", "strong", "a"],
			}],
		},
	},
})
