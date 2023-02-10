const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    parent: {
      type: String,
      required: true
  },
});

const AnalysisSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    context: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: false
    },
    user: { type: String, required: true },
    questions: [QuestionSchema]
});

const Analysis = mongoose.model('Analysis', AnalysisSchema);

module.exports = Analysis;

