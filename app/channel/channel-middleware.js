const channel = require('./channel');
const r = require('rethinkdb');
const request = require('superagent');

module.exports = {
  insert,
  subscribe,
  fetch,
  join,
};

/**
 * @Param {object} express.js request object
 * @Param {object} express.js response object
 */
function insert(req, res) {
  // validate recaptcha
  request
  .post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_API_KEY}&response=${req.body.captcha}`)
  .set('Content-Type', 'application/x-www-form-urlencoded')
  .end((err1, res1) => {
    if (!res1.body.success) {
      res.status(403).send({ err: 'captcha-error' });
    } else {
      r.connect({})
      .then((connection) => {
        channel.insert(connection, req.body.name)
        .then((channelId) => res.send({ id: channelId }))
        .catch(() => res.status(403).send({ err: 'channel-insert-error' }));
      });
    }
  });
}

/**
 * @Param {object} express.js request object
 * @Param {object} express.js response object
 */
function fetch(req, res) {
  if (req.params.id) {
    r.connect({ id: req.params.id })
    .then((connection) => {
      channel.fetch(connection, req.params.id)
      .then((snapshot) => res.status(200).send(snapshot))
      .catch(() => res.status(404).send({ err: 'channel-fetch-error' }));
    });
  } else {
    res.status(404).send({ err: 'channel-fetch-no-id-error' });
  }
}

/**
 * @Param {object} express.js request object
 * @Param {object} express.js response object
 */
function join(req, res) {
  if (req.params.id) {
    channel.join(req.params.id)
    .then((longID) => {
      res.send({
        id: longID,
      });
    })
    .catch(() => res.status(500).send({ err: 'channel-join-error' }));
  } else {
    res.status(404).send({ err: 'channel-join-no-id-error' });
  }
}

function subscribe(socket) {
  return function channelSubscriptionEvent(data) {
    r.connect({ id: data.id })
    .then((connection) => {
      channel.observable(connection, data.id)
      .subscribe(
        (changes) => socket.emit(changes.evt, changes.val),
        (err) => socket.emit('err', err)
      );
    });
  };
}
