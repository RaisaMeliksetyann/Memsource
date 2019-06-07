const axios = require('axios');
const qs = require('qs');

const api = axios.create({
    baseURL: 'https://cloud.memsource.com/web/api2/v1',
    headers: {'content-type': 'application/json'}
});

module.exports = {
    login: async (username, password) => {

        const credentials = {
            userName: username,
            password: password
        };
        console.log(qs.stringify(credentials));
        const response = await api.post(`/auth/login`, qs.stringify(credentials));
        return response;
    }
};