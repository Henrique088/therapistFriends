// src/pages/Notificacoes.jsx
import React, { useEffect, useState } from 'react';
import MenuLateral from '../../Components/Menu/MenuLateral';
import './Notificacoes.css';
// import { useSocket } from './../../contexts/SocketContext';

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  // const socket = useSocket();

  useEffect(() => {
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
  }, []);

  const marcarComoLida = (notificacaoId) => {
    fetch(`http://localhost:3001/notificacoes/${notificacaoId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao marcar como lida');
        // Remove do estado para atualizar a tela
        setNotificacoes((prev) =>
          prev.filter((n) => n.id !== notificacaoId)
        );
      })
      .catch((err) => console.error(err));
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
        marcarComoLida(notificacaoId); // <- marca como lida após atualização
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
                      onClick={() => marcarComoLida(notificacao.id)}
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
