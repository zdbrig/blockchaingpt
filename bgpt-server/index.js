const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const amqp = require('amqplib/callback_api');
const Task = require('./Task'); // importing the Task model
const Analysis = require('./Analysis');
const axios = require('axios')
const jwt = require( 'jsonwebtoken');

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

app.post('/auth/github', (req, res) => {
    const code = req.body.code;
    if (!code) {
      return res.status(400).send('Bad Request: No code found');
    }
    // Make a POST request to GitHub's access_token endpoint to exchange the code for an access token
    axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }, {
      headers: {
        Accept: 'application/json',
      },
    })
      .then(({ data }) => {
        const access_token = data.access_token;
        // Use the access token to get the user's profile information
        axios.get('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
          .then(({ data }) => {
            // Store the access token and user information in the server-side session
            let user = { user: data.login };
           
            const token = jwt.sign(
                { user: data.login },
                "secret"
              );
        
              // save user token
              user.access_token = token;
              
            // Redirect the user back to the client-side
            return res.send(user);
          })
          .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
          });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Internal Server Error');
      });
  });
  

const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) 
        return ;
  
    try {
        
      const decoded = jwt.verify(token.substring(7), "secret");
      req.user = decoded.user;
      next();
    } catch (error) {
      res.status(400).send('Invalid Token');
    }
  };
  
  app.use(authenticate);

app.post('/query', async (req, res) => {
    try {
        if (!req.user) {
            return res.status(403).send('Invalid Token');
        } else {
        }
        // Declare a queue
        const queue = 'openai-queue';
        connectedChannel.assertQueue(queue, {
            durable: true
        });

        let obj = {
            id: req.body.id,
            status: 'pending',
            parent: '',
            user: req.user,
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
    if (!req.user) {
        return res.status(403).send('Invalid Token');
    } else {
    }
  try {
    const tasks = await Task.find({user: req.user});
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/analysis', (req, res) => {
    if (!req.user) {
        return res.status(403).send('Invalid Token');
    } else {
    }
    Analysis.find({user: req.user})
        .then(analyses => res.json(analyses))
        .catch(err => res.status(404).json({ success: false }));
});




app.listen(3001, () => {
    console.log('Listening on port 3001');
});