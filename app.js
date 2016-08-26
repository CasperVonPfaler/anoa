const fs = require('fs');
const express = require('express');
const compression = require('compression');
const PouchDB = require('pouchdb');
const expressPouchDB = require('express-pouchdb');
const devServer = require('./dev.server');

const app = express();
const PORT = process.env.PORT || 5000;
const PROD = process.env.NODE_ENV === 'production';
const DB_DIR = process.env.DB_DIR || 'database';

if (!fs.existsSync(`${__dirname}/${DB_DIR}`)) {
  fs.mkdirSync(`${__dirname}/${DB_DIR}`);
}

const db = PouchDB.defaults({ prefix: `${__dirname}/${DB_DIR}/` });

//app.use(compression());
app.use(express.static('dist'));
app.use('/db', expressPouchDB(db));

app.get('*', (req, res, next) => {
  if (req.accepts('html')) res.sendFile(`${__dirname}/index.html`);
  else next();
});


if (PROD) {
  app.listen(PORT);
  console.log('app ready at :5000')
} else {
  app.listen(PORT - 1);
  devServer(PORT);
}
