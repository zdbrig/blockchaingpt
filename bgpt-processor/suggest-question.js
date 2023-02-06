const callopenai = require('./call-openai');
const mongoose = require('mongoose');
const log = require("./log");
const createAnalysis = require('./createAnalysis');
const addQuestionToAnalysis = require('./addQuestionToAnalysis');

async function loadQuestions() {
    try {
      const db = mongoose.connection;
      const collection = db.collection("questions");
      const questions = await collection.find({}).sort({ $natural: -1 })
      .limit(5).toArray();
  
  
      return questions.map(q => q.string).join(" ");
    } catch (err) {
      console.error(err);
      return "";
    }
  }

let suggest_question = async (answer , previousQuestion) => {
    await createAnalysis(previousQuestion);
    let questions = await loadQuestions();
    let query =  `These questions between backets  [ ${questions} ] has been already asked. List me all the possible tasks that can be done by you to perform this goal.`;
    log(`suggestion query is : ${query}`);
    let response = await callopenai(query);
    log(`response is : ${response}`);
    const items = response.match(/\d+\.\s[^\d]+/g);
    items.map( async item => {
      let pureItem = item.replace(/^\d+\.\s/, "");
      await addQuestionToAnalysis(previousQuestion , pureItem);
    });
    return items;
}

module.exports = suggest_question;


