const webpack = require('webpack');
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');

var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  }),
];
var entry = [
  'babel-polyfill',
  `${__dirname}/src/index.jsx`,
];

if (process.env.NODE_ENV === 'dev') {
  const dashboard = new Dashboard();

  plugins = plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new DashboardPlugin(dashboard.setData),
  ]);

  entry = [
    'webpack/hot/only-dev-server',
    'webpack-dev-server/client?http://localhost:5000',
  ].concat(entry);
}

module.exports = {
  entry,
  output: {
    path: `${__dirname}/dist`,
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
        loader: 'babel?presets[]=es2015&presets[]=react',
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
  plugins,
};
