const Analysis = require('./Analysis');

const addQuestionToAnalysis = (context, question, parent ) => {
    Analysis.findOne({ context })
        .then(analysis => {
            if (!analysis) {
                throw new Error(`Analysis with context "${context}" not found.`);
            }
            analysis.questions.push({ question , answer: "--" , parent });
            return analysis.save();
        })
        .then(analysis => console.log(`Question added to analysis: ${analysis}`))
        .catch(err => console.log(err));
};

module.exports = addQuestionToAnalysis;
