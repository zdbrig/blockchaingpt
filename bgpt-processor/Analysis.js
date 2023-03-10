const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: false
    },
    parent: {
        type: String,
        required: false
    }
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
    user: {
        type: String,
        required: false
    },
    questions: [QuestionSchema]
});

const Analysis = mongoose.model('Analysis', AnalysisSchema);

module.exports = Analysis;

