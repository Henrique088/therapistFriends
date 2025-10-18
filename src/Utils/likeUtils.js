// src/Utils/likeUtils.js

import api from '../api/apiConfig';

export async function darLikeNoRelato(relatoId) {
  try {
    const response = await api.post(`/relatos/like/${relatoId}`);

    return {
      sucesso: true,
      mensagem: response.data.msg,
      quantidadeLikes: response.data.quantidadeLikes,
      liked: response.data.liked,
    };
  } catch (error) {
    console.error('Erro ao dar like no relato:', error);
    return {
      sucesso: false,
      erro: error.response?.data?.message || error.message || 'Erro ao dar like',
    };
  }
}