// src/Utils/likeUtils.js

export async function darLikeNoRelato(relatoId) {
  try {
    const response = await fetch(`http://localhost:3001/relatos/like/${relatoId}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Erro ao dar like');
    }

    const data = await response.json();
    return {
      sucesso: true,
      mensagem: data.msg,
      quantidadeLikes: data.quantidadeLikes,
      liked: data.liked,
    };
  } catch (error) {
    console.error('Erro ao dar like no relato:', error);
    return {
      sucesso: false,
      erro: error.message,
    };
  }
}
