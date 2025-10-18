// src/contexts/SocketContext.js
import { createContext, useContext, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socketRef = useRef(null);


  const getSocketUrl = () => {
    // Se estiver em produção ou usando ngrok
    if (window.location.hostname !== 'localhost') {
      // Usa o mesmo host do frontend (que será o ngrok)
      return window.location.origin;
    }
    // Desenvolvimento local
    return 'http://localhost:3001';
  };

  const socketUrl = getSocketUrl();
  // Inicializa o socket uma única vez
  if (!socketRef.current) {
    socketRef.current = io(socketUrl, {
      withCredentials: true,
      autoConnect: true,
    });
  }

  

 //desconecta o socket quando o usuário fecha a aba
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (socketRef.current) socketRef.current.disconnect();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  useEffect(() => {
    return () => {
      if (!socketRef.current) socketRef.current.disconnect(); //analisar depois
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
}

// Hook personalizado para acessar o socket
export function useSocket() {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return socket;
}