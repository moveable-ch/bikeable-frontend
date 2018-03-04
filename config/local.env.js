var merge = require('webpack-merge')
var prodEnv = require('./dev.env')

module.exports = merge(prodEnv, {
	BACKEND_URL: '\'http://localhost:3000\''
})
