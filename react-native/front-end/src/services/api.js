import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.15:3001/api/phonebooks', 
 
  timeout: 5000,
});

export default api;
