const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const cors = require('cors');

const apiKey = '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';
const configuration = new Configuration({
apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);
const app = express();

app.use(cors());
app.use(express.json());

app.post('/query', async (req, res) => {
try {
const response = await openai.createCompletion({
model: "text-davinci-003",
prompt: JSON.stringify(req.body.query),
temperature: 0,
max_tokens: 4048,
frequency_penalty: 0,
presence_penalty: 0,
});


res.json({ answer: response.data.choices[0].text });
} catch (error) {
console.error(error);
res.status(500).send(error);
}
});

app.listen(3001, () => {
console.log('Listening on port 3001');
});