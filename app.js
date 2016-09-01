const express = require('express');
const compression = require('compression');
const testDb = require('./app/test-db');

const app = express();
const PORT = process.env.PORT || 5000;
const PROD = process.env.NODE_ENV === 'production';

app.use(compression());
app.use(express.static(`${__dirname}/dist`, { maxAge: 86400000 }));

if (!PROD) {
  console.log('using in memory test database');
  app.use('/db', testDb);
}

app.get('*', (req, res, next) => {
  if (req.accepts('html')) res.sendFile(`${__dirname}/index.html`);
  else next();
});

app.listen(PORT, () => {
  console.log(`app started at:${PORT}`);
});
