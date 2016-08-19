const api = require('./app/api');
const dev = require('./app/dev');

const PORT = process.env.PORT || 5000;
const PROD = process.env.NODE_ENV === 'production';

if (PROD) {
  api(PORT);
} else {
  api(PORT - 1);
  dev(PORT);
}
