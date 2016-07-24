const r = require('rethinkdb');
const Promise = require('bluebird');

/**
 * Fetches a channel from the database
 *
 * @Param {object} an open rethinkdb connection
 * @param {string} id of the channel to fetch
 * @Return {object} promise that resolves to the fetched channel
 */
module.exports = function channelFetch(connection, id) {
  return new Promise((resolve, reject) => {
    const response = {};

    r.db('test').table(id)
    .run(connection)
    .then((cursor) => {
      cursor.toArray((err, results) => {
        if (err) reject(err);

        results
        .filter((el) => el.id === 'meta')
        .forEach((el) => {
          response.name = el.meta.name;
          response.shortID = el.meta.shortID;
        });
        response.questions = results.filter((el) => el.id !== 'meta');

        resolve(response);
      });
    })
    .catch(reject);
  });
};
