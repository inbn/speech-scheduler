const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
  entry: ['./src/css/styles.css', './src/js/app.js'],
  output: {
    filename: 'js/bundle.js',
    path: path.join(__dirname, 'public/build/')
  },
  module: {
    // Fix for all language files being included by default, see: https://github.com/webpack/webpack/issues/198#issuecomment-104688430
    noParse: [/moment.js/],
    rules: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { 
                sourceMap: true, 
                importLoaders: 1 
              }
            }, 
            {
              loader: 'postcss-loader'
            }
          ]
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'css/styles.css',
      disable: false,
      allChunks: true
    })
  ],
  watch: true
}