const webpack = require('webpack');
const WebackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');

module.exports = (PORT) => {
  new WebackDevServer(webpack(webpackConfig), {
    proxy: {
      '**': `http://localhost:${PORT - 1}`,
    },
    hot: true,
    historyApiFallback: true,
    quiet: true,
    inline: true,
  })
  .listen(PORT);
};
