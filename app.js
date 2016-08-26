process.env.PWD = process.cwd();


const express = require('express');
const compression = require('compression');
const PouchDB = require('pouchdb');
const memdown = require('memdown');
const expressPouchDB = require('express-pouchdb');
const devServer = require('./dev.server');

const app = express();
const PORT = process.env.PORT || 5000;
const PROD = process.env.NODE_ENV === 'production';
const CWD = process.cwd();

const db = PouchDB.defaults({ db: memdown });

const pouchConfig = {
  mode: 'minimumForPouchDB',
}

app.use(compression());
app.use(express.static(__dirname + '/dist'));
app.use('/db', expressPouchDB(db, pouchConfig));

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
