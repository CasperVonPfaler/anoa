/**
 * Express middleware that creates a database and generates api
 * credentials for that database. The database will be locked for everyone
 * else
 */

const cloudantConstructor = require('cloudant');

const account = process.env.CLOUDANT_ACCOUNT;
const password = process.env.CLOUDANT_PASSWORD;
const cloudant = cloudantConstructor({ account, password });

function createNewDatabase(id) {
  return new Promise((resolve, reject) => {
    cloudant.db.create(id, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log('database created');
        resolve();
      }
    });
  });
}

function generateApiCredentials() {
  return new Promise((resolve, reject) => {
    cloudant.generate_api_key((err, credentials) => {
      if (err) {
        reject(err);
      } else {
        console.log('api credentials generated');
        resolve(credentials);
      }
    });
  });
}

function setSecurityRules(id, credentials) {
  return new Promise((resolve, reject) => {
    if (!id || !credentials) {
      reject('missing id or api in setSecurityRules');
    } else {
      const rules = {};
      rules.nobody = [];
      rules[credentials.key] = ['_reader', '_writer'];

      const newDatabase = cloudant.db.use(id);
      newDatabase.set_security(rules, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('security rules set');
          resolve(credentials);
        }
      });
    }
  });
}

function storeApiCredentials(id, credentials) {
  return new Promise((resolve, reject) => {
    if (!id || !credentials) {
      reject('missing id or api in storeApiCredentials');
    } else {
      const apiCredentialsDatabase = cloudant.use('api-keys');
      const newCredentials = {
        _id: id,
        key: credentials.key,
        pass: credentials.password,
        timestamp: new Date(),
      };

      apiCredentialsDatabase.insert(newCredentials, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('api credentials stored');
          resolve(credentials);
        }
      });
    }
  });
}

module.exports = (req, res, next) => {
  const id = req.body.id;

  if (!id) {
    res.status(403).send({ err: 'missing id' });
  } else {
    createNewDatabase(id)
    .then(() => generateApiCredentials())
    .then((credentials) => setSecurityRules(id, credentials))
    .then((credentials) => storeApiCredentials(id, credentials))
    .then((credentials) => {
      res.status(200).send({
        key: credentials.key,
        pass: credentials.password,
      });
      next();
    })
    .catch((err) => {
      console.log(err);
      res.status(403).send({ err });
    });
  }
};
