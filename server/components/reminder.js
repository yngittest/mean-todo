'use strict';

const moment = require('moment');

import Todo from '../api/todo/todo.model';
import ifttt from './ifttt';

export default function() {
  const searchDate = new Date();
  Todo
    .find({ done: false })
    .populate('user', 'iftttKey')
    .then(function(todos) {
      let targetTodos = todos.filter(function(todo) {
        return requiresNotification(todo, searchDate);
      });
      if(targetTodos.length > 0) {
        sendNotifications(targetTodos);
      }
    });
}

function requiresNotification(todo, date) {
  let diff = moment(todo.due).diff(moment(date), 'minutes', true);
  return diff >= 0 && diff < 1;
}

function sendNotifications(todos) {
  todos.forEach(function(todo) {
    const eventId = 'todoReminder';
    let key = todo.user.iftttKey;
    let value = [
      todo.name,
      moment(todo.due).format('YYYY/MM/DD HH:mm'),
      ''
    ];
    ifttt(eventId, key, value);
  });
}
