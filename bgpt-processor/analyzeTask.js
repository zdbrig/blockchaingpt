const mongoose = require('mongoose');
const fs = require('fs');
const log = require('./log');
const { throws } = require('assert');
const callopenai = require('./call-openai');
const suggest_question = require('./suggest-question');
const Task = require('./Task');
const addAnswerToQuestion = require('./addAnswerToQuestion');
const addQuestionToAnalysis = require('./addQuestionToAnalysis');
const createAnalysis = require('./createAnalysis');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });


let analyzeTask = async (task, channel) => {
  try {
    log(`analyzing query ${task}`);
    let text = await callopenai(`the context is ${task.context}. Now my task is :  ${task.query}`);
    log("got response" + text);

    await addAnswerToQuestion(task.context, task.query, text);
    let items = text.match(/\d+\.\s[^\d]+/g);
    if (!items) {
      text= await callopenai(`the context is ${task.context}. What are the steps to realize this task:  ${task.query}`);
      items = text.match(/\d+\.\s[^\d]+/g);
    }
    if (items) {
      
      const queue = 'openai-analyze';
      channel.assertQueue(queue, {
        durable: true
      });
      items.map(async item => {
        let pureItem = item.replace(/^\d+\.\s/, "");
        
        await addQuestionToAnalysis(task.context,pureItem , task.query);

        let obj = {
          id: '' + Math.floor(Math.random() * 100),
          status: 'pending',
          context: task.context,
          query: pureItem,
          result: ''
        };

        channel.sendToQueue(queue, Buffer.from(JSON.stringify(obj)), {
          persistent: true
        });
      });


    } else {
      
    console.log("no further questions about this task");
  /*    const queue = 'openai-queue';
      channel.assertQueue(queue, {
        durable: true
      });
      let newq = await callopenai(`the context is ${task.context}. Now my task is :  ${text}`);
      let obj = {
        id: '' + Math.floor(Math.random() * 100),
        status: 'pending',
       
        query: newq,
        result: ''
      };

      channel.sendToQueue(queue, Buffer.from(JSON.stringify(obj)), {
        persistent: true
      }); */

    }

    return text;

  } catch (err) {
    console.error(err);

  }
}



module.exports = analyzeTask;