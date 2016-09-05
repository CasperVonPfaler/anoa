const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');

const createDatabse = require('./app/cloudant/create-database');
const getDatabaseCredentials = require('./app/cloudant/get-credentials');
const setDatabseDestruction = require('./app/cloudant/set-database-destruction');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(compression());
app.use(bodyParser.json());
app.post('/api/createDatabase', createDatabse, setDatabseDestruction);
app.get('/api/getDatabaseCredentials/:id', getDatabaseCredentials);

app.use(express.static(`${__dirname}/dist`, { maxAge: 86400000 }));
app.get('*', (req, res, next) => {
  if (req.accepts('html')) res.sendFile(`${__dirname}/index.html`);
  else next();
});

app.listen(PORT, () => {
  console.log(`app started at:${PORT}`);
});
