import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { useSocket } from './SocketContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { usuario } = useUser();
  const socket = useSocket();
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [conversationUnreadCounts, setConversationUnreadCounts] = useState({});

  useEffect(() => {
    if (!socket || !usuario) return;

    // Lógica para receber uma nova mensagem e atualizar as contagens
    const handleNewMessage = (message) => {
      // Verifica se a mensagem é para a conversa atual (opcional, dependendo da sua tela de chat)
      // Se não for para a conversa atual, incrementa a contagem de não lidas
      // Aqui, assumimos que todas as novas mensagens devem ser contadas
      
      setUnreadChatCount(prevCount => prevCount + 1);

      // Atualiza a contagem para a conversa específica
      setConversationUnreadCounts(prevCounts => ({
        ...prevCounts,
        [message.conversaId]: (prevCounts[message.conversaId] || 0) + 1
      }));
    };

    socket.on('receive_message', handleNewMessage);

    return () => {
      socket.off('receive_message', handleNewMessage);
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
    // Adicione outras funções/estados relevantes para o chat aqui
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  return useContext(ChatContext);
};