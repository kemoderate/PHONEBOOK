import axios from 'axios';

const api = axios.create({
  baseURL:'http://localhost:3001/api/phonebooks', 
 
  timeout: 5000,
});

export default api;
