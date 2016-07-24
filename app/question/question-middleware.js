const question = require('./question.js');
const r = require('rethinkdb');

module.exports = {
  insert,
};

/**
 * @Param {object} express.js request object
 * @Param {object} express.js response object
 */
function insert(req, res) {
  r.connect({ id: req.body.id })
  .then((connection) => question.insert(connection, req.body.id, req.body.question))
  .then((insertedQuestion) => res.send(insertedQuestion))
  .catch(() => res.status(404).send({ err: 'question-insert-error' }));
}
