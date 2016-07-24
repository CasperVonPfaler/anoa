const rx = require('rx');
const r = require('rethinkdb');

/**
 * @Param {Object} open rethinkdb connection
 * @Param {String} id of the thable that should be subscribed to
 * @Return {Object} rx observable
 */
module.exports = function channelObservable(connection, channelID) {
  return rx.Observable.create((observer) => {
    r.db('test')
    .table(channelID)
    .changes({ includeTypes: true, includeStates: true })
    .run(connection)
    .then(cursor => {
      cursor.each((err, snapshot) => {
        console.log(snapshot);
        if (err) observer.onError(err);
        else if (snapshot.type !== 'state') {
          if (snapshot.old_val === null) {
            observer.onNext({ evt: 'newQuestion', val: snapshot.new_val });
          } else {
            observer.onNext({ evt: 'newAnswer', val: snapshot.new_val });
          }
        }
      });
    })
    .error(observer.onError);
  });
};
