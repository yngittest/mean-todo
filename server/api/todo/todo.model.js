'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './todo.events';

var TodoSchema = new mongoose.Schema({
  done: Boolean,
  name: String,
  due: String,
  doneDate: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

TodoSchema.pre('find', function(next) {
  this.populate('user', 'name');
  next();
});
TodoSchema.pre('findById', function(next) {
  this.populate('user', 'name');
  next();
});

registerEvents(TodoSchema);
export default mongoose.model('Todo', TodoSchema);
