const Analysis = require('./Analysis');

const addAnswerToQuestion = (context, question, answer) => {
    Analysis.findOne({ context })
        .then(analysis => {
            if (!analysis) {
                throw new Error(`Analysis with context "${context}" not found.`);
            }
            const index = analysis.questions.findIndex(q => q.question === question);
            if (index === -1) {
                throw new Error(`Question "${question}" not found in analysis.`);
            }
            analysis.questions[index].answer = answer;
            return analysis.save();
        })
       
            .catch(err => console.log(err));
};

module.exports = addAnswerToQuestion;