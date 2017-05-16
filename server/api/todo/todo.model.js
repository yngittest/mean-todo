'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './todo.events';

var TodoSchema = new mongoose.Schema({
  done: Boolean,
  name: String,
  due: String,
  done_date: String
});

registerEvents(TodoSchema);
export default mongoose.model('Todo', TodoSchema);
