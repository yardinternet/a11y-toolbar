const merge= require('deepmerge');
const eslintSettings = merge(require('@yardinternet/eslint-config'), [
    {
        rules: {
            "jsdoc/no-undefined-types": 0,
        },
    },
])

module.exports = eslintSettings;