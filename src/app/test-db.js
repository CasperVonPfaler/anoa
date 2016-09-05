const PouchDB = require('pouchdb');
const expressPouchDB = require('express-pouchdb');
const memdown = require('memdown');

const db = PouchDB.defaults({ db: memdown });
const dbConfig = { mode: 'minimumForPouchDB'};

const testDb = expressPouchDB(db, dbConfig);

module.exports = testDb;