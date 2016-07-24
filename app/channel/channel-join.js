const Promise = require('bluebird');
const request = require('superagent');

/**
 * Expand a short url and return the long one
 *
 * @param {string} channel short id
 * @Return {object} promise that resolves to the long url id
 */
module.exports = function channelFetch(id) {
  return new Promise((resolve, reject) => {
    request
    .get(`https://www.googleapis.com/urlshortener/v1/url?shortUrl=http://goo.gl/${id}&key=${process.env.LINK_SHORTENER_API_KEY}`)
    .end((err, res) => {
      if (err) reject(err);
      console.log(res.body.longUrl.replace('http://localhost:5000/channel/', ''));
      resolve(res.body.longUrl.replace('http://localhost:5000/channel/', ''));
    });
  });
};
