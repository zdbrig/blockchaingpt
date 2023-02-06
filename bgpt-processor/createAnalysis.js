const Analysis = require('./Analysis');

const createAnalysis = (context) => {
    const newAnalysis = new Analysis({ context });
    newAnalysis.save()
        .then(analysis => console.log(`Analysis created: ${analysis}`))
        .catch(err => console.log(err));
};

module.exports = createAnalysis;
