var join = require('path').join
var webpack = require('webpack')

module.exports = function (options) {
  var entry = join(__dirname, '../../app/main')

  var config = {
    entry: !options.production ? [
      'webpack-dev-server/client?http://localhost:' + options.devPort,
      'webpack/hot/dev-server'
    ].concat(entry) : entry,
    output: {
      path: join(__dirname, '../../build/js'),
      filename: 'bundle.js',
      publicPath: '/js/'
    },
    module: {
      loaders: [
        {
          test: /\.ts$/,
          loader: !options.production ? 'react-hot!typescript-simple-loader' : 'typescript-simple-loader'
        }
      ]
    },
    plugins: [
      new webpack.EnvironmentPlugin([
        'TRAKT_TV_CLIENT_ID', 'TRAKT_TV_CLIENT_SECRET', 'NODE_ENV'
      ]),
      new webpack.NoErrorsPlugin()
    ],
    debug: !options.production,
    devtool: options.production ? 'source-map' : 'inline-source-map',
    resolve: {
      extensions: ['', '.ts', '.js', '.jsx']
    }
  }

  // Minify the output in production.
  if (options.production) {
    config.plugins.push(
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    )
  } else {
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        __URL__: '\'http://localhost:' + process.env.PORT + '\''
      })
    )
  }

  return webpack(config)
}
