'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './todo.events';

var TodoSchema = new mongoose.Schema({
  done: Boolean,
  name: String,
  group: String,
  due: Date,
  doneDate: Date,
  repeat: Number,
  repeatType: String,
  repeatInterval: Number,
  repeatUnit: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

registerEvents(TodoSchema);
export default mongoose.model('Todo', TodoSchema);
