const express = require('express');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 5000;
const PROD = process.env.NODE_ENV === 'production';

app.use(compression());
app.use(express.static(`${__dirname}/dist`, { maxAge: 86400000 }));

app.get('*', (req, res, next) => {
  if (req.accepts('html')) res.sendFile(`${__dirname}/index.html`);
  else next();
});

app.listen(PORT, () => {
  console.log(`app started at:${PORT}`);
});
