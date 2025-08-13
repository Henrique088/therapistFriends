import axios from 'axios';
import { toast } from 'react-toastify';

// Configuração base do Axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/',
  timeout: 30000,
  withCredentials: true, // Habilita o envio de cookies
  credentials: 'include', // Garante que credenciais sejam incluídas
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor de requisição (opcional - para adicionar headers adicionais se necessário)
api.interceptors.response.use(
  (response) => {
    // Se a resposta tiver dados, retorne-os.
    // Caso contrário, retorne a resposta completa para que você possa verificar o status
    // Por exemplo, uma resposta 204 (No Content)
    return response.data !== undefined ? response.data : response;
  },
  (error) => {
    // ... restante do seu código de tratamento de erro
    return Promise.reject(error);
  }
);

export default api;