import PouchDB from 'pouchdb';

const remoteUrl = `${location.protocol}//${location.host}/db/`;

/**
 * @param {string} id of the database
 */
export function setLocalDatabseFromRemote(id) {
  const database = {
    local: new PouchDB(id),
    remote: new PouchDB(
      `${remoteUrl}${id}`,
      { skip_setup: true }
    ),
  };

  return new Promise((resolve, reject) => {
    database.remote.info()
    .then(() => database.local.replicate.from(database.remote))
    .then(() => {
      resolve(database);
    })
    .catch(() => {
      reject('no remote database');
    });
  });
}

/**
 * @param {string} id of the database
 */
export function setLocalDatabaseFromLocal(id) {
  const database = {
    local: new PouchDB(id, { skip_setup: true }),
    remote: new PouchDB(
      `${remoteUrl}${id}`,
       { skip_setup: true }
    ),
  };

  return new Promise((resolve, reject) => {
    database.local.info()
    .then(() => {
      resolve(database);
    })
    .catch(() => {
      database.local.destory();
      reject('no local database');
    });
  });
}

/**
 * @param {sting} id of the database
 */
export function createNewDatabase(id) {
  const database = {
    local: new PouchDB(id),
    remote: new PouchDB(`${remoteUrl}${id}`),
  };

  return new Promise((resolve) => {
    resolve(database);
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
  .then(() => database.local.replicate.to(database.remote))
  .then(() => new Promise((resolve) => {
    resolve(database);
  }));
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
    resolve();
  });
}

/**
 * @param {object} local database reference
 */
export function getDatabaseMeta(localDatabase) {
  return localDatabase.get('meta');
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
 */