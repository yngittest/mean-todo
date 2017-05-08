'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './todo.events';

var TodoSchema = new mongoose.Schema({
  name: String,
  due: String
});

registerEvents(TodoSchema);
export default mongoose.model('Todo', TodoSchema);
