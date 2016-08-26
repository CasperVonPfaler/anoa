import PouchDB from 'pouchdb';

export function setLocalDatabseFromRemote(id) {
  const database = {
    local: new PouchDB(id),
    remote: new PouchDB(
      `https://localhost:5000/db/${id}`,
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

export function setLocalDatabaseFromLocal(id) {
  const database = {
    local: new PouchDB(id, { skip_setup: true }),
    remote: new PouchDB(
      `https://localhost:5000/db/${id}`,
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

export function createNewDatabase(id) {
  const database = {
    local: new PouchDB(id),
    remote: new PouchDB(`https://localhost:5000/db/${id}`),
  };

  return new Promise((resolve) => {
    resolve(database);
  });
}

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

export function setDatabaseInState(dispatch, database) {
  return new Promise((resolve) => {
    dispatch({
      type: 'DATABASE_SET',
      payload: database,
    });
    resolve();
  });
}

export function getDatabaseMeta(localDatabase) {
  return localDatabase.get('meta');
}

export function storeQuestionInDatabase(database, newQuestion) {
  const { local, remote } = database;

  return local.put(newQuestion)
  .then(() => local.replicate.to(remote));
}

export function storeAnswerInDatabase(database, newAnswer) {
  const { local, remote } = database;

  return local.put(newAnswer)
  .then(() => local.replicate.to(remote));
}
