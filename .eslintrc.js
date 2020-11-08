module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  extends: [
    "plugin:vue/recommended",
    "prettier/vue",
    "plugin:prettier/recommended"
  ],
  plugins: [],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-undef": 0,
    "template-curly-spacing": 0,
    "vue/singleline-html-element-content-newline": "off",
    "vue/component-name-in-template-casing": [
      "error",
      "kebab-case",
      { registeredComponentsOnly: false }
    ],
    "vue/component-definition-name-casing": ["error", "kebab-case"]
  }
};
