const r = require('rethinkdb');

const channel = require('./channel');

module.exports = {
  insert,
  subscribe,
  fetch,
  join,
};

/**
 * Validates recaptcha and if successfull inserts the channel into the databse
 * responds to the channel with the id of the newly created channel
 *
 * @Param {object} express.js request object
 * @Param {object} express.js response object
 */
function insert(req, res) {
  if (!req.body.name || !req.headers.host) {
    res.status(503).send({ err: 'channel-inser-error: missing request parameters' });
  }
  r.connect({})
  .then((connection) => {
    channel.insert(connection, req.body.name, req.headers.host)
    .then((channelId) => res.send({ id: channelId }))
    .catch(() => res.status(403).send({ err: 'channel-insert-error' }));
  });
}

/**
 * Responds to the client with a snapshot of the channel
 *
 * @Param {object} express.js request object
 * @Param {object} express.js response object
 */
function fetch(req, res) {
  if (!req.params.id) {
    res.status(404).send({ err: 'channel-fetch-error: missing id' });
  } else {
    r.connect({ id: req.params.id })
    .then((connection) => {
      channel.fetch(connection, req.params.id)
      .then((snapshot) => res.status(200).send(snapshot))
      .catch(() => res.status(404).send({ err: 'channel-fetch-error' }));
    });
  }
}

/**
 * Transforms a short id to a long id and sends it back to the client
 *
 * @Param {object} express.js request object
 * @Param {object} express.js response object
 */
function join(req, res) {
  if (!req.params.id) {
    res.status(404).send({ err: 'channel-join-error: missing id' });
  } else {
    channel.join(req.params.id, req.headers.host)
    .then((longID) => {
      res.send({
        id: longID,
      });
    })
    .catch(() => res.status(500).send({ err: 'channel-join-error' }));
  }
}

/**
 * Subscribes to a channel and sends changes to the client when the channel data
 * changes. The emitted changes are always a channel object
 */
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
