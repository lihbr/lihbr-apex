module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  extends: ["plugin:vue/recommended", "plugin:prettier/recommended"],
  plugins: [],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-undef": 0,
    indent: ["error", 2, { SwitchCase: 1, ignoredNodes: ["TemplateLiteral"] }],
    "template-curly-spacing": 0,
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "vue/max-attributes-per-line": [
      "error",
      {
        singleline: 4,
        multiline: {
          max: 4,
          allowFirstLine: false
        }
      }
    ],
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "always",
          normal: "always",
          component: "always"
        }
      }
    ],
    "vue/singleline-html-element-content-newline": "off",
    "vue/component-name-in-template-casing": [
      "error",
      "kebab-case",
      { registeredComponentsOnly: false }
    ],
    "vue/component-definition-name-casing": ["error", "kebab-case"]
  },
  overrides: [
    {
      files: "*.vue",
      rules: {
        "prettier/prettier": [
          "error",
          {
            parser: "vue"
          }
        ]
      }
    }
  ]
};
