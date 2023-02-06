const fs = require('fs');

const log = (message) => {
    const date = new Date().toISOString();
    const logMessage = `${date}: ${message}\n`;
    console.log(logMessage);
    fs.appendFile('logs.txt', logMessage, (err) => {
      if (err) {
        console.error(err);
      }
    });
  };

module.exports = log;