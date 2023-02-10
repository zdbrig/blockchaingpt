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
        .catch(err => console.log(err));
};

module.exports = addQuestionToAnalysis;
