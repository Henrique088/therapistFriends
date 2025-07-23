// src/hooks/useNotificacoes.js
import { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { toast } from 'react-toastify';

export default function useNotificacoes() {
  const socket = useSocket();

  useEffect(() => {
    const handleNotificacao = ({ mensagem }) => {
      toast.info(mensagem);
    };

    const setupListeners = () => {
      socket.on('nova_notificacao', handleNotificacao);
      console.log('Listeners configurados');
    };

    setupListeners();
    
    // Reconfigura listeners quando reconecta
    socket.on('connect', setupListeners);

    return () => {
      socket.off('nova_notificacao', handleNotificacao);
      socket.off('connect', setupListeners);
    };
  }, [socket]);
}
