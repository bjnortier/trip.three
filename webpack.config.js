module.exports = {
  entry: {
    'events.test': "./test/functional/src/events.test.js",
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: /(lib|test|node_modules\/trip.core\/lib|node_modules\/trip.dom\/lib)/,
        loader: 'babel',
        query: {
          presets: [
            require.resolve('babel-preset-es2015'),
          ]
        }
      },
    ],
  },
  output: {
    path: 'test/functional/bundles/',
    filename: "[name].bundle.js"
  },
  devtool: "eval",
  node: {
    net: 'empty',
    dns: 'empty',
    crypto: 'empty',
  }
};
