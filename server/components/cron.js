'use strict';

const CronJob = require('cron').CronJob;
const moment = require('moment');

import Todo from '../api/todo/todo.model';

export default function startCron() {
  console.log('cron start!');
  const job = new CronJob('00 * * * * *', function() {
    sendNotifications();
  }, null, true);
}

function sendNotifications() {
  const searchDate = new Date();
  Todo
    .find({ done: false })
    .then(function(todos) {
      let targetTodos = todos.filter(function(todo) {
        return requiresNotification(todo, searchDate);
      });
      if(targetTodos.length > 0) {
        sendReminders(targetTodos);
      }
    });
}

function requiresNotification(todo, date) {
  let diff = moment(todo.due).diff(moment(date), 'minutes', true);
  return diff >= 0 && diff < 1;
}

function sendReminders(todos) {
  todos.forEach(function(todo) {
    console.log(todo.name + ' due ' + todo.due);
  });
}
