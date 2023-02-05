const amqp = require('amqplib/callback_api');
const mongoose = require('mongoose');
const Task = require('./Task'); // importing the Task model
const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');
const log = require('./log');
const client = require("./processor-client");
const { query } = require('express');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

amqp.connect(process.env.HQ_URI, (error, connection) => {
  if (error) {
    log(error);
    throw error;
  }

  // Create a channel
  connection.createChannel((error, channel) => {
    if (error) {
      log(error);
      throw error;
    }
   work(channel);

  });
});


let work = async (connectedChannel) => {

  // Declare a queue
  const queue = 'openai-context-queue';


  log(` [*] Waiting for messages in ${queue}. To exit press CTRL+C`);

  connectedChannel.prefetch(3);
  // Consume messages from the queue
  connectedChannel.consume(queue, async (message) => {
    try {
    const task = JSON.parse(message.content.toString());
    log(` [x] Received '${task.query}'`);
    let mtask = new Task(
      task
    );
    mtask.status = 'processing';
    await mtask.save();
    

    // call the api 
    let text = await client.contextQuery({query: JSON.stringify(task.query)});

    
    mtask.result = text;
    mtask.status = 'done';
    await mtask.save();


  } catch (error) {
    log(error);


  }


  // Do the work
  setTimeout(() => {
    connectedChannel.ack(message);
  }, 5000);
}, {
  noAck: false
      });
};

