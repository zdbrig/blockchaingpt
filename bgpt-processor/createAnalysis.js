const Analysis = require('./Analysis');

const createAnalysis = (context , user , id) => {
    const newAnalysis = new Analysis({ context , user , id});
    newAnalysis.save()
        
        .catch(err => console.log(err));
};

module.exports = createAnalysis;
