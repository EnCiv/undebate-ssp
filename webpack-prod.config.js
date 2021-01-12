const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  context: path.resolve(__dirname, 'dist'), // dist because app failed when building this as a node_module in another component
  entry: {
    main: './client/main.js',
  },
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'assets/webpack'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js|\.jsx$/,
        exclude: /node_modules/,
        use: 'babel-loader'

      }
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  node: {
    fs: 'empty', // logger wants to require fs though it's not needed on the browser
  },
  plugins: [
    new webpack.IgnorePlugin(/nodemailer/), // not used in the client side - those should be move outside of the app directory
  ],
}
