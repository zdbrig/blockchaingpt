const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Connection pool options
const poolOptions = {
  poolSize: 10, // number of connections in the pool
  keepAlive: true, // keep unused connections open for a certain time period
  keepAliveInitialDelay: 300000, // time period for which unused connections will be kept open (in ms)
};

// Create a new MongoClient instance
const client = new MongoClient(url, { useNewUrlParser: true, poolOptions });

// Connect to the MongoDB server
client.connect((err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }

  console.log('Connected to MongoDB!');

  // Use the database
  const db = client.db('mydb');

  // Perform database operations here
});

module.exports = {
  client,
  db,
};
