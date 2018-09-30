const webpack = require('webpack')
module.exports = {
	configureWebpack: {
		plugins: [
			new webpack.LoaderOptionsPlugin({
				options: {
					stylus: {
						import: [__dirname + '/node_modules/rupture/rupture/index.styl']
					}
				}
			})
		]
	},

}