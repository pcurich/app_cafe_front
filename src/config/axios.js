import axios from 'axios';

const config = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL
});

export default config;