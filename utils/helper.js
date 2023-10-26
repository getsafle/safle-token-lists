const axios = require('axios')

const getRequest = async ({ url, headers }) => {
    try {
        const response = await axios({
            url: `${url}`,
            method: 'GET',
            headers
        });
        return { response: response.data };
    } catch (error) {
        return { error: [{ name: 'server', message: `There is some issue, Please try after some time. ${error.message && error.message}`, data: error.response && error.response.data ? error.response.data : {} }] };
    }
};


  module.exports = {
    getRequest
  }