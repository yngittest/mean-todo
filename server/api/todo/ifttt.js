'use strict';

import request from 'request';

export default function(todo) {
  const eventId = 'apitest';
  const myKey = '***';
  const url = `https://maker.ifttt.com/trigger/${eventId}/with/key/${myKey}`;

  const headers = {
    'Content-Type': 'application/json'
  };

  var options = {
    url: url,
    method: 'POST',
    headers: headers,
    json: true,
    form: { value1: todo.name, value2: dateToString(todo.doneDate) }
  };

  request(options, function(error, response, body) {
    if(!error && response.statusCode == 200) {
      console.log(body);
    } else {
      console.log(`error: ${response.statusCode}`);
    }
  });
}

function dateToString(datestring) {
  const date = new Date(datestring);
  return date.getFullYear() + '/'
        + date.getMonth() + '/'
        + date.getDate() + ' '
        + date.getHours() + ':'
        + date.getMinutes() + ':'
        + date.getSeconds();
}
