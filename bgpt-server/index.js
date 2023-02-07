const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const amqp = require('amqplib/callback_api');
const Task = require('./Task'); // importing the Task model
const Analysis = require('./Analysis');




const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let connectedChannel = null;
amqp.connect(process.env.HQ_URI, (error, connection) => {
    if (error) {
        throw error;
    }

    // Create a channel
    connection.createChannel((error, channel) => {
        if (error) {
            throw error;
        }

        connectedChannel = channel;
    });
});

app.post('/query', async (req, res) => {
    try {

        // Declare a queue
        const queue = 'openai-queue';
        connectedChannel.assertQueue(queue, {
            durable: true
        });

        let obj = {
            id: '' + Math.floor(Math.random() * 100),
            status: 'pending',
            parent: '',
            query: req.body.query,
            result: ''
          };
        
        connectedChannel.sendToQueue(queue,Buffer.from( JSON.stringify(obj)), {
            persistent: true
        });


        res.json({ answer: "task added to the queue" });
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});


// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/analysis', (req, res) => {
    Analysis.find({})
        .then(analyses => res.json(analyses))
        .catch(err => res.status(404).json({ success: false }));
});




app.listen(3001, () => {
    console.log('Listening on port 3001');
});