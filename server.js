const express = require('express');
const app = express();
const server = require('http').Server(app); // eslint-disable-line new-cap
const io = require('socket.io')(server);
const bodyParser = require('body-parser');

const channelMiddleware = require('./app/channel/channel-middleware');
const questionMiddleware = require('./app/question/question-middleware');
const answerMiddleware = require('./app/answer/answer-middleware');

// express use
app.use(express.static(`${__dirname}/dist`));
app.use(bodyParser.json());

// express post
app.post('/api/channelInsert', channelMiddleware.insert);
app.post('/api/questionInsert', questionMiddleware.insert);
app.post('/api/answerInsert', answerMiddleware.insert);

// express get
app.get('/api/channelGet/:id', channelMiddleware.fetch);
app.get('/api/channelJoin/:id', channelMiddleware.join);
app.get('*', (req, res, next) => {
  if (req.accepts('html')) res.sendFile(`${__dirname}/index.html`);
  else next();
});

// socket listeners
io.on('connection', (socket) => {
  socket.emit('connectionSuccess');
  socket.on('channelSubscribe', channelMiddleware.subscribe(socket));
});

// start the app
server.listen(process.env.PORT, () => {
  console.log(`server at localhost://${process.env.PORT}`);
});
