const webpack = require('webpack');
const WebackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

new WebackDevServer(webpack(config), {
  proxy: {
    '**': 'http://localhost:5000',
  },
  hot: true,
  historyApiFallback: true,
  quiet: true,
  inline: true,
})
.listen(5001);

