const express = require('express');
const app = express();
const server = require('http').Server(app); // eslint-disable-line new-cap
const io = require('socket.io')(server);
const bodyParser = require('body-parser');

const channelMiddleware = require('./app/channel/channel-middleware');
const questionMiddleware = require('./app/question/question-middleware');
const answerMiddleware = require('./app/answer/answer-middleware');

// express use
app.use(bodyParser.json());
app.use(express.static('public/dist'));

// express post
app.post('/app/channelInsert', channelMiddleware.insert);
app.post('/app/questionInsert', questionMiddleware.insert);
app.post('/app/answerInsert', answerMiddleware.insert);

// express get
app.get('/app/channelGet/:id', channelMiddleware.fetch);
app.get('/app/channelJoin/:id', channelMiddleware.join);

app.get('*', (req, res, next) => {
  if (req.accepts('html')) res.sendFile(`${__dirname}/public/index.html`);
  else next();
});

// socket listeners
io.on('connection', (socket) => {
  socket.emit('connectionSuccess');
  socket.on('channelSubscribe', channelMiddleware.subscribe(socket));
});

// start the app
server.listen(5000, () => {
  console.log('app at localhost://5000');
});
