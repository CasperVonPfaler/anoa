const express = require('express');
const compression = require('compression');
const PouchDB = require('pouchdb');
const memdown = require('memdown');
const expressPouchDB = require('express-pouchdb');
const devServer = require('./dev.server');

const app = express();
const PORT = process.env.PORT || 5000;
const PROD = process.env.NODE_ENV === 'production';

const db = PouchDB.defaults({ db: memdown });

const pouchConfig = {
  mode: 'minimumForPouchDB',
};

app.use(compression());
app.use(express.static(`${__dirname}/dist`, { maxAge: 86400000 }));
app.use('/db', expressPouchDB(db, pouchConfig));

app.get('*', (req, res, next) => {
  if (req.accepts('html')) res.sendFile(`${__dirname}/index.html`);
  else next();
});


if (PROD) {
  app.listen(PORT);
  console.log('app listening at port 5000'); //eslint-disable-line
} else {
  app.listen(PORT - 1);
  devServer(PORT);
}
