module.exports = {
	'root': true,
	'env': {
		'node': true,
		'es6': true
	},
	'extends': [
		'eslint:recommended',
		'prettier'
	],
	'parserOptions': {
		'parser': 'babel-eslint',
		'ecmaVersion': 2020,
		'sourceType': 'module'
	},
	'rules': {
		'no-console': 'off',
		'no-debugger': 'off',
		'no-tabs': 0,
		'indent': [
			'error',
			'tab',
			{
				'ignoredNodes': [
					'TemplateLiteral'
				]
			}
		],
		'semi': [
			'error',
			'always'
		],
		'quotes': [
			'error',
			'single'
		],
		'array-bracket-spacing': 2,
		'array-element-newline': [
			'error',
			'consistent'
		],
		'block-spacing': 2,
		'brace-style': 2,
		'camelcase': 2,
		'comma-spacing': [
			'error',
			{
				'before': false,
				'after': true
			}
		],
		'no-lonely-if': 2,
		'no-mixed-spaces-and-tabs': 2,
		'no-negated-condition': 2,
		'wrap-regex': 2,
		'space-before-function-paren': 0
	},
	'plugins': [
		'prettier'
	]
};