// src/hooks/useNotificacoes.js
import { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { toast } from 'react-toastify';

export default function useNotificacoes() {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return; // Adicione esta verificação

    const handleNotificacao = ({ mensagem }) => {
      toast.info(mensagem);
    };

    const setupListeners = () => {
      // Remove listeners antigos primeiro para evitar duplicação
      socket.off('nova_notificacao', handleNotificacao);
      socket.on('nova_notificacao', handleNotificacao);
    };

    // Configura listeners inicialmente
    setupListeners();
    
    // Reconfigura listeners quando reconecta
    socket.on('connect', setupListeners);

    return () => {
      socket.off('nova_notificacao', handleNotificacao);
      socket.off('connect', setupListeners);
    };
  }, [socket]); 
}