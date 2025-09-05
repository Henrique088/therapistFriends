// src/pages/Notificacoes.jsx
import React, { useEffect, useState } from 'react';
import MenuLateral from '../../Components/Menu/MenuLateral';
import './Notificacoes.css';
import { useNotifications } from '../../contexts/NotificationContext'; // Importar o hook

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const { fetchNotifications, markAsRead } = useNotifications(); // Usar o contexto

  useEffect(() => {
    fetchNotificacoes();
  }, []);

  const fetchNotificacoes = () => {
    fetch('http://localhost:3001/notificacoes', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Notificações:', data);
        setNotificacoes(data);
      })
      .catch((err) => console.error('Erro ao buscar notificações:', err));
  };

  const handleMarcarComoLida = (notificacaoId) => {
    markAsRead(notificacaoId).then(() => {
      // Atualizar a lista local
      setNotificacoes((prev) => prev.filter((n) => n.id !== notificacaoId));
    });
  };

  const atualizarStatus = (idSolicitacao, status, notificacaoId) => {
    fetch(`http://localhost:3001/solicitacoes/atualizaSolicitacao/${idSolicitacao}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: status })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao atualizar solicitação");
        return res.json();
      })
      .then(() => {
        handleMarcarComoLida(notificacaoId);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="container">
      <MenuLateral />
      <div className="conteudo">
        <h2>Notificações</h2>
        <ul className="lista">
          {notificacoes.length === 0 ? (
            <p>Sem notificações.</p>
          ) : (
            notificacoes.map((notificacao) => (
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
                    >
                      Aceitar
                    </button>
                    <button
                      className="botao-recusar"
                      onClick={() =>
                        atualizarStatus(notificacao.solicitacao_id, 'rejeitada', notificacao.id)
                      }
                    >
                      Recusar
                    </button>
                  </div>
                ) : (
                  <div className="botoes">
                    <button
                      className="botao-marcar-lida"
                      onClick={() => handleMarcarComoLida(notificacao.id)}
                    >
                      Marcar como lida
                    </button>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}