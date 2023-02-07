const express = require('express');
const cors = require('cors');
const processTask = require('./processTask');
const amqp = require('amqplib/callback_api');

const app = express();

app.use(cors());
app.use(express.json());

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
    console.log(req.body.query);
    try {
        
        let response = await processTask(req.body, connectedChannel);

        res.send({ answer: response});
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

app.listen(3003, () => {
    console.log('Listening on port 3003');
});