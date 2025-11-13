import React, { useEffect, useState } from 'react';
import MenuLateral from '../../Components/Menu/MenuLateral';
import './Notificacoes.css';
import { useNotifications } from '../../contexts/NotificationContext';
import api from '../../api/apiConfig';

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(null); 
  const { fetchNotifications, markAsRead } = useNotifications();

  useEffect(() => {
    fetchNotificacoes();
  }, []);

  const fetchNotificacoes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/notificacoes');
      setNotificacoes(response.data);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarComoLida = async (notificacaoId) => {
    setUpdating(notificacaoId);
    try {
      await markAsRead(notificacaoId);
      setNotificacoes((prev) => prev.filter((n) => n.id !== notificacaoId));
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    } finally {
      setUpdating(null);
    }
  };

  const atualizarStatus = async (idSolicitacao, status, notificacaoId) => {
    setUpdating(notificacaoId);
    try {
      await api.put(`/solicitacoes/atualizaSolicitacao/${idSolicitacao}`, { 
        status: status 
      });
      
      await handleMarcarComoLida(notificacaoId);
      
    } catch (error) {
      console.error('Erro ao atualizar solicitação:', error);
      setUpdating(null);
    }
  };

  return (
    <div className="container">
      <MenuLateral />
      <div className="conteudo">
        <h2>Notificações</h2>
        
        {loading ? (
          <p>Carregando notificações...</p>
        ) : notificacoes.length === 0 ? (
          <p>Sem notificações.</p>
        ) : (
          <ul className="lista">
            {notificacoes.map((notificacao) => (
              <li key={notificacao.id} className="item">
                <div className="titulo">{notificacao.titulo}</div>
                <div className="mensagem">{notificacao.mensagem}</div>
                <div className="data">
                  {new Date(notificacao.data_envio).toLocaleString('pt-BR')}
                </div>

                {notificacao.titulo.includes('Nova Solicitação') ? (
                  <div className="botoes">
                    <button
                      className="botao-aceitar"
                      onClick={() =>
                        atualizarStatus(notificacao.solicitacao_id, 'aprovada', notificacao.id)
                      }
                      disabled={updating === notificacao.id}
                    >
                      {updating === notificacao.id ? 'Processando...' : 'Aceitar'}
                    </button>
                    <button
                      className="botao-recusar"
                      onClick={() =>
                        atualizarStatus(notificacao.solicitacao_id, 'rejeitada', notificacao.id)
                      }
                      disabled={updating === notificacao.id}
                    >
                      {updating === notificacao.id ? 'Processando...' : 'Recusar'}
                    </button>
                  </div>
                ) : (
                  <div className="botoes">
                    <button
                      className="botao-marcar-lida"
                      onClick={() => handleMarcarComoLida(notificacao.id)}
                      disabled={updating === notificacao.id}
                    >
                      {updating === notificacao.id ? 'Processando...' : 'Marcar como lida'}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}