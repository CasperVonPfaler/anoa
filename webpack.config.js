const webpack = require('webpack');
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');

const PROD = process.env.NODE_ENV === 'production';

function choosePlugins(production) {
  if (!production) {
    const dashboard = new Dashboard();
    return [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      new webpack.HotModuleReplacementPlugin(),
      new DashboardPlugin(dashboard.setData),
    ];
  }
  return [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
  ];
}

function chooseEntry(production) {
  if (!production) {
    return [
      'babel-polyfill',
      'webpack/hot/only-dev-server',
      'webpack-dev-server/client?http://localhost:5001',
      `${__dirname}/src/public/index.jsx`,
    ];
  }
  return [
    'babel-polyfill',
    `${__dirname}/src/public/index.jsx`,
  ];
}


module.exports = {
  entry: chooseEntry(PROD),
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
  plugins: choosePlugins(PROD),
};