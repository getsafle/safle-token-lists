const axios = require('axios');
const {proxyServiceBaseURL} = require('../constants')

const getRequest = async ({ url, token }) => {
    try {
        const URL = `${proxyServiceBaseURL}?url=${url}&token=${token}&tokenType=Bearer`;
        const response = await axios({
            url: URL,
            method: 'GET',
        });
        return { response: response.data };
    } catch (error) {
        return{ error: error.response.data}
    }
};


  module.exports = {
    getRequest
  }