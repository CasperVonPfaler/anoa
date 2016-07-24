const r = require('rethinkdb');
const Promise = require('bluebird');
const uuid = require('node-uuid');

/**
 * @Param {Object} an open rethinkdb connection
 * @Param {String} id for the channel the question should be posted to
 * @Param {String} the question itself
 */
module.exports = function insertQuestion(connection, channelID, question) {
  return new Promise((resolve, reject) => {
    const newQuestion = {
      answers: [],
      time: new Date(),
      text: question,
      id: uuid.v1().replace(/-/g, '_'),
    };

    r.db('test').table(channelID).insert(newQuestion)
    .run(connection)
    .then(() => resolve(newQuestion))
    .catch(reject);
  });
};
