const express = require('express');
const webpack = require('webpack');
const WebackDevServer = require('webpack-dev-server');
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
const defaultWebpackConfig = require('./webpack.config');
const testDb = require('./app/test-db');

const app = express();
const PORT = process.env.PORT || 5000;
const dashboard = new Dashboard();
const devWebpackConfig = Object.assign({}, defaultWebpackConfig, {
  entry: [
    'babel-polyfill',
    'webpack/hot/only-dev-server',
    'webpack-dev-server/client?http://localhost:5000',
    `${__dirname}/src/index.jsx`,
  ],
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new DashboardPlugin(dashboard.setData),
  ],
});
const devServer = new WebackDevServer(webpack(devWebpackConfig), {
  proxy: {
    '**': `http://localhost:${PORT - 1}`,
  },
  hot: true,
  historyApiFallback: true,
  quiet: true,
  inline: true,
});

app.use(express.static(`${__dirname}/dist`));
app.use('/db', testDb);

app.get('*', (req, res, next) => {
  if (req.accepts('html')) res.sendFile(`${__dirname}/index.html`);
  else next();
});

app.listen(PORT - 1);
devServer.listen(PORT);

