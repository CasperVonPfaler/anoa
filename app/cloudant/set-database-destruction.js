const schedule = require('node-schedule');
const cloudantConstructor = require('cloudant');

const account = process.env.CLOUDANT_ACCOUNT;
const password = process.env.CLOUDANT_PASSWORD;
const cloudant = cloudantConstructor({ account, password });

// NOT WORKING

function destoryDatabase(id) {
  cloudant.db.destory(id, (err) => {
    console.log('destoryded db: ' + id);
    console.log(err);
  });
}

function scheduleDesturction(id, date) {
  return Promise.resolve(() => {
    schedule.scheduleJob(date, destoryDatabase.bind(null, id));
    return true;
  });
}

// swap this to minutes. Something like 30min
function determineDestructionDate(minutes) {
  return Promise.resolve(new Date(new Date().getTime + (minutes * 60000)));
}

module.exports = (req, res) => {
  const id = req.body.id;

  if (!id) {
    res.status(403).send({ err: 'missing id' });
  } else {
    const minutesUntildDestruction = req.body.days ? req.body.days : 1;

    determineDestructionDate(minutesUntildDestruction)
    .then((destructionDate) => scheduleDesturction(id, destructionDate))
    .then(() => {
      console.log(`databse will be destoryed after ${minutesUntildDestruction} minutes`);
    });
  }
};
