const cloudantConstructor = require('cloudant');

const account = process.env.CLOUDANT_ACCOUNT;
const password = process.env.CLOUDANT_PASSWORD;
const cloudant = cloudantConstructor({ account, password });

function getCredentials(id) {
  const apiCredentialsDatabase = cloudant.use('api-keys');

  return new Promise((resolve, reject) => {
    apiCredentialsDatabase.get(id, (err, body) => {
      if (err) {
        reject(`no api credentials foound for: ${id}`);
      } else {
        resolve(body);
      }
    });
  });
}

module.exports = (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(403).send({ err: 'missing id' });
  } else {
    getCredentials(id)
    .then((credentials) => {
      res.status(200).send({
        key: credentials.key,
        pass: credentials.pass,
      });
    });
  }
};
