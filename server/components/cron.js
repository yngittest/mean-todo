'use strict';

const CronJob = require('cron').CronJob;

import reminder from './reminder';

export default function startCron() {
  console.log('cron start!');
  const job = new CronJob('00 * * * * *', reminder, null, true);
}
