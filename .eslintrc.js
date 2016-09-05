module.exports = {
    "extends": "airbnb",
    "installedESLint": true,
    "plugins": [
        "react"
    ],
    "rules": {
        "no-use-before-define": ["error", { "functions": false, "classes": false }],
        "max-len": ["error", { "ignorePattern": "\\s*<" }],
        "no-underscore-dangle": ["error", { "allow": ["_id"] }],
        "import/no-extraneous-dependencies": ["error", {"devDependencies": true, "optionalDependencies": false, "peerDependencies": false}]
    }
};