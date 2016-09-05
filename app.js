const express = require('express');
const compression = require('compression');
const testDb = require('./src/app/test-db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(compression());
app.use('/db', testDb);

app.use(express.static(`${__dirname}/dist`, { maxAge: 86400000 }));
app.get('*', (req, res, next) => {
  if (req.accepts('html')) res.sendFile(`${__dirname}/index.html`);
  else next();
});

app.listen(PORT, () => {
  console.log(`app started at:${PORT}`);
});
