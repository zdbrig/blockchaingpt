const mongoose = require('mongoose');
const fs = require('fs');
const log = require('./log');
const { throws } = require('assert');
const callopenai = require('./call-openai');
const suggest_question = require('./suggest-question');
const Task = require('./Task');
const addAnswerToQuestion = require('./addAnswerToQuestion');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });


async function saveQuestion(str) {
  try {
    const db = mongoose.connection;
    const collection = db.collection("questions");
    await collection.insertOne({ string: str });
  } catch (err) {
    console.error(err);
  }
}

let analyzeTask = async (task, channel) => {
  try {
    log(`analyzing query ${task}`);
    let text = await callopenai(task.query);
    log("got response" + text);
    
    addAnswerToQuestion(task.context , task.query, text);


    


    return text;

  } catch (err) {
    console.error(err);

  }
}



module.exports = analyzeTask;