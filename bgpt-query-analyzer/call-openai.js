const { Configuration, OpenAIApi } = require("openai");
const apiKey = process.env.OPENAI_SECRET_KEY;
const configuration = new Configuration({
    apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);


let callOpenAi = async (prompt) => {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: JSON.stringify(prompt),
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 1.9,
        presence_penalty: 1.9,
        best_of: 1
      });

      return response.data.choices[0].text;
}

module.exports = callOpenAi;

