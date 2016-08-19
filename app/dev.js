const webpack = require('webpack');
const webpackConfig = require('../webpack.config');
const WebackDevServer = require('webpack-dev-server');

module.exports = (PORT) => {
  const server = new WebackDevServer(webpack(webpackConfig), {
    proxy: {
      '*': `http://localhost:${PORT - 1}`,
    },
    hot: true,
    historyApiFallback: true,
    quiet: true,
    inline: true,
    contentBase: 'public/',
  });
  server.listen(PORT, 'localhost');
};
