const r = require('rethinkdb');
const Promise = require('bluebird');
const uuid = require('node-uuid');

/**
 * @Param {Object} an open rethinkdb connection
 * @Param {String} id of the channel
 * @Param {String} id of the question
 * @Param {String} the answer
 */
module.exports = function insertAnswer(connection, channelID, questionID, answer) {
  return new Promise((resolve, reject) => {
    const newAnswer = {
      time: new Date(),
      text: answer,
      id: uuid.v1().replace(/-/g, '_'),
    };

    r.db('test').table(channelID).get(questionID)
    .update({
      answers: r.row('answers').append(newAnswer),
    })
    .run(connection)
    .then(() => resolve(newAnswer))
    .error(reject);
  });
};
