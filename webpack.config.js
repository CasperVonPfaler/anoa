const webpack = require('webpack');
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');

const dashboard = new Dashboard();

module.exports = {
  entry: [
    'webpack/hot/only-dev-server',
    'webpack-dev-server/client?http://localhost:5000',
    `${__dirname}/public/src/public.jsx`,
  ],
  output: {
    path: `${__dirname}/public/dist`,
    filename: 'index.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['react-hot', 'babel?presets[]=es2015&presets[]=react'],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
        },
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
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new DashboardPlugin(dashboard.setData),
  ],
};
