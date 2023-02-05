const axios = require('axios');



const callApi = {}

 callApi.simpleQuery = async (json) => {
    try {
        const response = await axios.post(process.env.PROCESSOR_URL+ "query", json);
        return response.data.answer;
      } catch (error) {
        console.error(error);
      }
}

callApi.contextQuery = async (json) => {
    try {
        const response = await axios.post(process.env.PROCESSOR_URL+ "context", json);
        return response.data.answer;
      } catch (error) {
        console.error(error);
      }
}


module.exports = callApi;