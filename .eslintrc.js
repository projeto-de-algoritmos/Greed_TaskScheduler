module.exports = {
    'env': {
        'browser': true,
        'vue/setup-compiler-macros': true
    },
    'extends': [
        'plugin:vue/essential',
        'airbnb-base',
        'plugin:prettier/recommended'
    ],
    'globals': {
        'Capacitor': 'readonly',
        '__statics': 'readonly',
        'chrome': 'readonly',
        'cordova': 'readonly',
        'ga': 'readonly',
        'process': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018,
        'parser': '@babel/eslint-parser',
        'sourceType': 'module'
    },
    'plugins': [
        'vue'
    ],
    'root': true,
    'rules': {
        'func-names': 'off',
        'import/default': 'error',
        'import/export': 'error',
        'import/extensions': 'off',
        'import/first': 'off',
        'import/named': 'error',
        'import/namespace': 'error',
        'import/no-extraneous-dependencies': 'off',
        'import/no-unresolved': 'off',
        'import/prefer-default-export': 'off',
        'max-classes-per-file': 'off',
        'no-debugger': 'off',
        'no-nested-ternary': 'off',
        'no-param-reassign': 'off',
        'no-void': 'off',
        'prefer-promise-reject-errors': 'off',
        'eol-last': ['error', 'always'],
        'prettier/prettier': [
            'error',
            {
                'arrowParens': 'always',
                'bracketSpacing': true,
                'semi': true,
                'singleQuote': true,
                'tabWidth': 2,
                'trailingComma': 'all'
            }
        ],
        'no-plusplus': 'off',
        'vue/multi-word-component-names': 'off'
    }
};
