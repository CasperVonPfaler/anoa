const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const compression = require('compression');
const path = require('path');

const channelMiddleware = require('./channel/channel-middleware');
const questionMiddleware = require('./question/question-middleware');
const answerMiddleware = require('./answer/answer-middleware');

module.exports = (PORT) => {
  const app = express();
  const server = http.Server(app); // eslint-disable-line
  const io = socketIo(server);

  app.use(bodyParser.json());
  app.use(compression());
  app.use(express.static(path.resolve(`${__dirname}/../public/dist`)));

  app.post('/api/channelInsert', channelMiddleware.insert);
  app.post('/api/questionInsert', questionMiddleware.insert);
  app.post('/api/answerInsert', answerMiddleware.insert);

  app.get('/api/channelGet/:id', channelMiddleware.fetch);
  app.get('/api/channelJoin/:id', channelMiddleware.join);

  app.get('*', (req, res, next) => {
    if (req.accepts('html')) res.sendFile(path.resolve(`${__dirname}/../public/index.html`));
    else next();
  });

  /* SOCKET.IO */
  io.on('connection', (socket) => {
    socket.emit('connectionSuccess');
    socket.on('channelSubscribe', channelMiddleware.subscribe(socket));
  });

  server.listen(PORT);
};
