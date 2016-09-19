module.exports = {
  entry: {
    'events.test': './test/functional/src/events.test.js',
    'snap.test': './test/functional/src/snap.test.js',
    'cameras.test': './test/functional/src/cameras.test.js',
    'annotations.test': './test/functional/src/annotations.test.js',
    'renderingorder.test': './test/functional/src/renderingorder.test.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules\/(three|jquery|moment)/,
        loader: 'babel',
      },
    ],
  },
  output: {
    path: 'test/functional/bundle/',
    filename: '[name].bundle.js',
  },
  node: {
    net: 'empty',
    dns: 'empty',
    crypto: 'empty',
  },
};
