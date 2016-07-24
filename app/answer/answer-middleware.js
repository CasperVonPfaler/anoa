const answer = require('./answer');
const r = require('rethinkdb');

module.exports = {
  insert,
};

/**
 * @Param {object} express.js request object
 * @Param {object} express.js response object
 */
function insert(req, res) {
  r.connect({ id: req.body.channelID })
  .then((connection) => {
    answer.insert(connection, req.body.channelID, req.body.questionID, req.body.answer)
    .then((insertedQuestion) => {
      res.send(insertedQuestion);
    });
  })
  .catch(() => {
    res.status(500).send({ err: 'answer-insert-error' });
  });
}
