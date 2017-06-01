'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './todo.events';

var TodoSchema = new mongoose.Schema({
  done: Boolean,
  name: String,
  due: Date,
  doneDate: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

registerEvents(TodoSchema);
export default mongoose.model('Todo', TodoSchema);
