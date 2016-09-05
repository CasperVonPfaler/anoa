import PouchDB from 'pouchdb';
import request from 'superagent';
import { timeSince } from '../utils/util';

/**
 * @param {string} id of the database
 * @return {promise} that resolves to the remote database credentials
 */
export function createRemoteDatabase(id) {
  return new Promise((resolve, reject) => {
    request
    .post('/api/createDatabase')
    .send({ id })
    .end((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.body);
      }
    });
  });
}

/**
 * @param {string} id of the database
 * @return {promise} that resolves to the remote database credentials
 */
export function getRemoteDatabaseCredentials(id) {
  return new Promise((resolve, reject) => {
    request
    .get(`/api/getDatabaseCredentials/${id}`)
    .end((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.body);
      }
    });
  });
}

export function initializeDatabase(id, credentials) {
  const database = {
    local: new PouchDB(id),
    remote: credentials ? new PouchDB(`https://${credentials.key}:${credentials.pass}@anoa.cloudant.com/${id}`) : null,
  };

  return Promise.resolve(database);
}

export function syncData(database) {
  return new Promise((resolve, reject) => {
    database.local.sync(database.remote)
    .then(() => {
      resolve(database);
    })
    .catch((err) => {
      reject(err);
    });
  });
}

/**
 * @param {object} database object containing a local and a remote database
 * @param {string} channel name to store in the database
 */
export function setDatabaseMeta(database, name) {
  return database.local.put({
    _id: 'meta',
    name,
    time: new Date(),
  })
  .then(() => Promise.resolve(database));
}

/**
 * @param {func} dispatch function
 * @param {object} database object containing a local and a remote database
 */
export function setDatabaseInState(dispatch, database) {
  return new Promise((resolve) => {
    dispatch({
      type: 'DATABASE_SET',
      payload: database,
    });
    resolve(database);
  });
}

/**
 * @param {object} local database reference
 */
export function getDatabaseMeta(database) {
  return database.local.get('meta');
}

/**
 * @param {object} database object containing a local and a remote database
 * @param {object} new question object
 */
export function storeQuestionInDatabase(database, newQuestion) {
  const { local, remote } = database;

  return local.put(newQuestion)
  .then(() => local.replicate.to(remote));
}

/**
 * @param {object} database object containing a local and a remote database
 * @param {object} new answer object
 */
export function storeAnswerInDatabase(database, newAnswer) {
  const { local, remote } = database;

  return local.put(newAnswer)
  .then(() => local.replicate.to(remote));
}

/**
 * @param {object} database object containing a local and a remote database
 * @param {object} new answer object
 */
export function getQuestions(database) {
  return database.local.allDocs({
    startkey: 'question@',
    endkey: 'question@\uffff',
    include_docs: true,
  });
}

/**
 * @param {array} Array containing all question objects of the channel
 * @param {object} Local pouchDB reference
 */
export function getAnswers(questions, database) {
  if (questions.rows <= 0) {
    return new Promise((resolve) => {
      resolve([]);
    });
  }

  // This is pretty bad to read.. should come up with clearer way
  return Promise.all(
    questions.rows.map((questionDoc) => database.local.allDocs({
      startkey: `answer@${questionDoc.doc._id}`,
      endkey: `answer@${questionDoc.doc._id}\uffff`,
      include_docs: true,
    })
    .then((questionAnswers) => new Promise((resolve) => {
      if (questionAnswers.rows <= 0) {
        resolve(Object.assign({}, questionDoc.doc, {
          answers: [],
          expanded: false,
          time: timeSince(Date.parse(questionDoc.doc.time)),
          answerInput: '',
        }));
      } else {
        resolve(Object.assign({}, questionDoc.doc, {
          answers: questionAnswers.rows.map((answerDoc) => answerDoc.doc),
          expanded: false,
          time: timeSince(Date.parse(questionDoc.doc.time)),
          answerInput: '',
        }));
      }
    })))
  );
}
