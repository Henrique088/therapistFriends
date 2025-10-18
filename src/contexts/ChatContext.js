import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { useSocket } from './SocketContext';
import api from '../api/apiConfig';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { usuario } = useUser();
  const socket = useSocket();
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [conversationUnreadCounts, setConversationUnreadCounts] = useState({});

  // 1. Efeito para buscar as contagens iniciais do back-end
  useEffect(() => {
    if (!usuario) return;

    const fetchInitialUnreadCounts = async () => {
      try {
        const response = await api.get('/conversas/nao-lidas');
        
        setUnreadChatCount(response.data.totalNaoLidas || 0);
        setConversationUnreadCounts(response.data.contagensPorConversa || {});
        
      } catch (error) {
        console.error('Erro na chamada inicial:', error.response?.data || error.message);
      }
    };
    
    fetchInitialUnreadCounts();
  }, [usuario]);

  // 2. Efeito para lidar com mensagens em tempo real
  useEffect(() => {
    if (!socket || !usuario) return;

    // Listener para o evento 'nova_mensagem_chat'
    const handleNewMessageChat = (payload) => {
      // Incrementa a contagem global apenas se a mensagem for de outro usuário
      if (payload.remetenteId !== usuario.id) {
        setUnreadChatCount(prevCount => prevCount + 1);
        
        setConversationUnreadCounts(prevCounts => ({
          ...prevCounts,
          [payload.conversaId]: (prevCounts[payload.conversaId] || 0) + 1
        }));
      }
    };

    // Listener para o evento de mensagens lidas
    const handleMessagesRead = ({ conversaId, leitorId }) => {
      if (leitorId === usuario.id) {
        setConversationUnreadCounts(prevCounts => {
          const newCounts = { ...prevCounts };
          const messagesRead = newCounts[conversaId] || 0;
          setUnreadChatCount(prevTotal => Math.max(0, prevTotal - messagesRead));
          delete newCounts[conversaId];
          return newCounts;
        });
      }
    };
    
    // Registra os listeners
    socket.on('nova_mensagem_chat', handleNewMessageChat);
    socket.on('mensagens_lidas', handleMessagesRead);
    
    // Função de limpeza
    return () => {
      socket.off('nova_mensagem_chat', handleNewMessageChat);
      socket.off('mensagens_lidas', handleMessagesRead);
    };
  }, [socket, usuario]);

  // Função para zerar as notificações de uma conversa quando o usuário a abre
  const clearUnreadCountForConversation = (conversaId) => {
    if (conversationUnreadCounts[conversaId]) {
      const messagesToClear = conversationUnreadCounts[conversaId];
      setUnreadChatCount(prevCount => prevCount - messagesToClear);
      setConversationUnreadCounts(prevCounts => {
        const newCounts = { ...prevCounts };
        delete newCounts[conversaId];
        return newCounts;
      });
    }
  };

  const value = {
    unreadChatCount,
    conversationUnreadCounts,
    clearUnreadCountForConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  return useContext(ChatContext);
};