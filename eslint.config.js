const eslint = {
    files: ["**/**/*.js"],
    rules: {
        "no-console": "error",
        "no-unused-vars": "error",
        "no-var": "error",
        "prefer-const": "error",
        "eqeqeq": ["error", "always"],
        "func-style": ["error", "expression"],

        "no-multiple-empty-lines": ["warn", { max: 2 }],
        "consistent-return": "warn",

        "semi": ["error", "always"],
        "quotes": ["error", "double"],
        "comma-dangle": ["error", "always-multiline"],
        "indent": ["error", 4],
        "prefer-arrow-callback": ["error", { allowNamedFunctions: false }],
        "space-before-blocks": ["error", "always"],
        "key-spacing": ["error", { beforeColon: false, afterColon: true }],
        "arrow-spacing": ["error", { before: true, after: true }],
        "prefer-destructuring": ["warn", { object: true }],
    },
};


export default eslint;