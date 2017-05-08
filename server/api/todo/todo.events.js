/**
 * Todo model events
 */

'use strict';

import {EventEmitter} from 'events';
var TodoEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
TodoEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Todo) {
  for(var e in events) {
    let event = events[e];
    Todo.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    TodoEvents.emit(event + ':' + doc._id, doc);
    TodoEvents.emit(event, doc);
  };
}

export {registerEvents};
export default TodoEvents;
