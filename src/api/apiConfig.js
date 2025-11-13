import axios from 'axios';

// Detecta o host atual (localhost, IP, domínio etc)
const host = window.location.hostname;

// Define a baseURL dinamicamente
let baseURL;
if (host === 'localhost' || host === '127.0.0.1') {
  baseURL = 'http://localhost:3001/';
} else {
  baseURL = `http://${host}:3001/`;
}

// Log para depuração (opcional)
console.log('🌍 API Base URL:', baseURL);

// Configuração base do Axios
const api = axios.create({
  baseURL,
  timeout: 30000,
  withCredentials: true, // Habilita envio de cookies
  credentials: 'include', // Mantém credenciais
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor de resposta
api.interceptors.response.use(
  (response) => {
    return response !== undefined ? response : response.msg;
  },
  (error) => {
    if (error.response) {
      console.error('Erro da API:', error.response.data);
    } else {
      console.error('Erro de rede:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
