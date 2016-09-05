const schedule = require('node-schedule');
const cloudantConstructor = require('cloudant');

const account = process.env.CLOUDANT_ACCOUNT;
const password = process.env.CLOUDANT_PASSWORD;
const cloudant = cloudantConstructor({ account, password });

// NOT WORKING

function destoryDatabase(id) {
  cloudant.db.destroy(id, () => {
    console.log(`destoryded db: ${id}`);
  });
}

function scheduleDesturction(id, date) {
  return Promise.resolve(
    schedule.scheduleJob(date, destoryDatabase.bind(null, id))
  );
}

// swap this to minutes. Something like 30min
function determineDestructionDate(minutes) {
  const now = new Date();
  now.setTime(now.getTime() + (minutes * 60000));

  return Promise.resolve(now);
}

module.exports = (req, res) => {
  const id = req.body.id;

  if (!id) {
    res.status(403).send({ err: 'missing id' });
  } else {
    const minutesUntildDestruction = req.body.minutes ? req.body.minutes : 60;

    determineDestructionDate(minutesUntildDestruction)
    .then((destructionDate) => scheduleDesturction(id, destructionDate))
    .then(() => {
      console.log(`databse will be destoryed after ${minutesUntildDestruction} minutes`);
    });
  }
};
