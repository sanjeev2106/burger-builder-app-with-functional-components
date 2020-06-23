import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://myburgerbuilder-feceb.firebaseio.com/'
})

export default instance;