module.exports = {
  entry: './public/src/public.js',
  output: {
    path: './public/dist',
    filename: 'index.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
      },
      {
        test: /\.html$/,
        loader: 'html',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
};
