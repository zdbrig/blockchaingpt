const mongoose = require('mongoose');
const fs = require('fs');
const log = require('./log');
const { throws } = require('assert');
const callopenai = require('./call-openai');
const suggest_question = require('./suggest-question');
const Task = require('./Task');
const callOpenAiImage = require('./call-openai-image');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function exists(str) {
  try {

    const db = mongoose.connection;;
    const collection = db.collection("strings");
    const result = await collection.findOne({ string: str });
    return !!result;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function saveString(str) {
  try {
    const db = mongoose.connection;
    const collection = db.collection("strings");
    await collection.insertOne({ string: str });
    log(`String "${str}" has been saved in the database.`);
  } catch (err) {
    console.error(err);
  } finally {
  }
}

async function saveQuestion(str) {
  try {
    const db = mongoose.connection;
    const collection = db.collection("questions");
    await collection.insertOne({ string: str });
  } catch (err) {
    console.error(err);
  }
}



let processTask = async (task, channel) => {
  try {
    log(`processing query ${task}`);
    let text = await callOpenAiImage(task.query);
    log("got response" + text);
    await saveQuestion(task.query);
    let mtask = new Task(
      task
    );
    mtask.status = "done";
    mtask.result = text;
    await mtask.save();


    suggest_question(text, task.query).then(
      (suggestions) => {
        if (suggestions) {
          suggestions.map((suggestion) => {
            let pureItem = suggestion.replace(/^\d+\.\s/, "");
            const queue = 'openai-analyze';
            channel.assertQueue(queue, {
              durable: true
            });
            let obj = {
              id: '' + Math.floor(Math.random() * 100),
              status: 'pending',
              context: task.query,
              query: pureItem,
              result: ''
            };

            channel.sendToQueue(queue, Buffer.from(JSON.stringify(obj)), {
              persistent: true
            });
          });
        }
      }

    );


    return text;

  } catch (err) {
    console.error(err);

  }
}



module.exports = processTask;