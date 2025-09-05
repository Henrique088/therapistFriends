// contexts/NotificationContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications deve ser usado dentro de um NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const socket = useSocket();

  // Carregar notificações ao inicializar
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Escutar por novas notificações via socket
  useEffect(() => {
    if (socket) {
      socket.on('nova_notificacao', (data) => {
        setHasNewNotification(true);
        fetchNotifications(); // Recarregar notificações
      });

      return () => {
        socket.off('nova_notificacao');
      };
    }
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:3001/notificacoes/nao-lidas', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.total);
        setHasNewNotification(data.total > 0);
      }
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:3001/notificacoes/${notificationId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Atualizar contador
        setUnreadCount(prev => Math.max(0, prev - 1));
        setHasNewNotification(unreadCount - 1 > 0);
      }
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('http://localhost:3001/notificacoes/marcar-todas-lidas', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setUnreadCount(0);
        setHasNewNotification(false);
      }
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    hasNewNotification,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};