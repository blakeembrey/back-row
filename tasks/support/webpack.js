var join = require('path').join
var webpack = require('webpack')
var PORT = process.env.PORT || 3000
var PRODUCTION = process.env.NODE_ENV === 'production'

function noop () {}

module.exports = function (hot) {
  var entry = join(__dirname, '../../app/main.js')

  var CONFIG = {
    entry: hot ? [
      'webpack-dev-server/client?http://localhost:' + PORT,
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
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: hot ? 'react-hot!babel-loader' : 'babel-loader'
        }
      ]
    },
    plugins: [
      new webpack.EnvironmentPlugin([
        'NODE_ENV', 'TRAKT_TV_CLIENT_ID', 'TRAKT_TV_CLIENT_SECRET'
      ]),
      hot ? new webpack.HotModuleReplacementPlugin() : noop,
      PRODUCTION ? new webpack.optimize.DedupePlugin() : noop,
      PRODUCTION ? new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }) : noop,
      new webpack.NoErrorsPlugin()
    ],
    debug: !PRODUCTION,
    devtool: PRODUCTION ? 'source-map' : 'eval',
    resolve: {
      extensions: ['', '.js', '.jsx', '.ts']
    }
  }

  return webpack(CONFIG)
}
