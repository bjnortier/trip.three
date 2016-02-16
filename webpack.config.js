module.exports = {
  entry: {
    'events.test': "./test/functional/src/events.test.js",
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: /(test)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
    ],
  },
  output: {
    path: 'test/functional/bundles/',
    filename: "[name].bundle.js"
  },
  devtool: "#source-map",
  node: {
    net: 'empty',
    dns: 'empty',
    crypto: 'empty',
  }
};
