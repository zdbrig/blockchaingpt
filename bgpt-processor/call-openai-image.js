const { Configuration, OpenAIApi } = require("openai");
const apiKey = process.env.OPENAI_SECRET_KEY;
const configuration = new Configuration({
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);


let callOpenAiImage = async (prompt) => {
  const response = await openai.createImage({
    prompt: prompt,
    n: 1,
    size: "256x256",
  });
  image_url = response.data.data[0].url;



  return image_url;
}

module.exports = callOpenAiImage;

