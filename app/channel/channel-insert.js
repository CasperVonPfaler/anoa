const uuid = require('node-uuid');
const r = require('rethinkdb');
const request = require('superagent');
const Promise = require('bluebird');


/**
 * Inserts a new channel into the databases
 *
 * @Param {object} an open rethinkdb connection
 * @Param {string} name for the new channel
 * @Return {object} promise that resolves to the id of the new channel
 */
module.exports = function insertChannel(connection, channelName) {
  return new Promise((resolve, reject) => {
    const channelId = uuid.v1().replace(/-/g, '_');

    request
    .post(`https://www.googleapis.com/urlshortener/v1/url?key=${process.env.LINK_SHORTENER_API_KEY}`)
    .send({
      longUrl: `http://localhost:5000/channel/${channelId}`,
    })
    .end((err, res) => {
      if (err) reject(err);

      const meta = {
        name: channelName,
        shortID: res.body.id.replace('http://goo.gl/', ''),
      };

      r.db('rethinkdb').table('users').insert({ id: channelId, password: false })
      .run(connection)
      .then(() => r.db('test').tableCreate(channelId)
      .run(connection))
      .then(() => r.db('test').table(channelId).grant(channelId, { read: true, write: true, config: false })
      .run(connection))
      .then(() => r.db('test').table(channelId).insert({ id: 'meta', meta })
      .run(connection))
      .then(() => resolve(channelId))
      .catch(reject);
    });
  });
};
