const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  id: { type: String, required: true },
  status: { type: String, required: true },
  query: { type: String, required: true },
  user: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  result: { type: String }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
