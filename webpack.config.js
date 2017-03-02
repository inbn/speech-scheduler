module.exports = {
  entry: './src/js/app.js',
  output: {
    filename: './public/build/js/bundle.js'
  },
  // Fir for all language files being included by default, see: https://github.com/webpack/webpack/issues/198#issuecomment-104688430
  module: {
    noParse: [/moment.js/]
  },
  watch: true
}