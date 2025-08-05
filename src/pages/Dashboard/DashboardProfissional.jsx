// src/pages/Dashboard/DashboardProfissional.jsx
import React, { useState, useEffect, useRef } from 'react';
import MenuLateral from '../../Components/Menu/MenuLateral';
import './DashboardProfissional.css';
import { FiBell } from 'react-icons/fi';
import { useUser } from '../../contexts/UserContext';

export default function DashboardProfissional() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [respostas, setRespostas] = useState({});
  const [respostasEnviadas, setRespostasEnviadas] = useState({});
  const [modoEdicao, setModoEdicao] = useState({});
  const { usuario } = useUser();

  // Referência para o painel de notificações
  const notificationsRef = useRef(null);
  // Referência para o botão de notificações
  const notificationButtonRef = useRef(null);

  // Efeito para fechar notificações ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Se o painel de notificações está visível e o clique foi fora dele e fora do botão
      if (
        showNotifications &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target) &&
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    // Adiciona o listener quando o componente monta
    document.addEventListener('mousedown', handleClickOutside);
    
    // Remove o listener quando o componente desmonta
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const infoCards = [
    {
      title: 'Relatos pendentes',
      content: 'Você tem 5 relatos aguardando resposta.'
    },
    {
      title: 'Consultas agendadas',
      content: 'Hoje você tem 3 consultas agendadas.'
    },
    {
      title: 'Conselho do dia',
      content: 'Ouvir com empatia é o primeiro passo para ajudar verdadeiramente.'
    }
  ];

  const feedRelatos = [
    {
      id: 1,
      nome: 'Anônimo(a)',
      tempo: '2h atrás',
      texto: 'Tenho me sentido muito sozinho ultimamente, mesmo cercado de pessoas...'
    },
    {
      id: 2,
      nome: 'Anônimo(a)',
      tempo: '5h atrás',
      texto: 'Estou enfrentando dificuldades para dormir por causa da ansiedade.'
    },
    {
      id: 3,
      nome: 'Anônimo(a)',
      tempo: 'Ontem',
      texto: 'Tive uma crise de pânico e não soube como agir...'
    }
  ];

  const handleRespostaChange = (id, texto) => {
    setRespostas(prev => ({ ...prev, [id]: texto }));
  };

  const handleResponder = (id) => {
    const resposta = respostas[id];
    if (resposta) {
      alert(`Resposta enviada para o relato ${id}: ${resposta}`);
      setRespostasEnviadas(prev => ({ ...prev, [id]: resposta }));
      setRespostas(prev => ({ ...prev, [id]: '' }));
    }
  };

  const handleEditar = (id) => {
    setModoEdicao(prev => ({ ...prev, [id]: true }));
    setRespostas(prev => ({ ...prev, [id]: respostasEnviadas[id] }));
  };

  const handleSalvarEdicao = (id) => {
    const respostaEditada = respostas[id];
    if (respostaEditada) {
      alert(`Resposta editada para o relato ${id}: ${respostaEditada}`);
      setRespostasEnviadas(prev => ({ ...prev, [id]: respostaEditada }));
      setModoEdicao(prev => ({ ...prev, [id]: false }));
      setRespostas(prev => ({ ...prev, [id]: '' }));
    }
  };

  const handleExcluir = (id) => {
    if (window.confirm('Tem certeza que deseja excluir a resposta?')) {
      setRespostasEnviadas(prev => {
        const novoEstado = { ...prev };
        delete novoEstado[id];
        return novoEstado;
      });
    }
  };

  return (
    <div className="app">
      <MenuLateral />
      <div className="main-content">
        <div className="content-header">
          <h1>Bem-vindo(a), {usuario.nome}</h1>
          <button
            className="notification-button"
            ref={notificationButtonRef}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FiBell size={24} />
          </button>
        </div>

        {showNotifications && (
          <div className="notifications-panel" ref={notificationsRef}>
            <p>🔔 Você tem novas mensagens e atualizações.</p>
          </div>
        )}

        <div className="info-cards-container">
          {infoCards.map((card, index) => (
            <div key={index} className="info-card">
              <h3>{card.title}</h3>
              <p>{card.content}</p>
            </div>
          ))}
        </div>

        <div className="relatos-feed">
          <h2>Relatos Recentes</h2>
          <div className="relatos-grid">
            {feedRelatos.map((relato) => (
              <div key={relato.id} className="relato-card">
                <div className="relato-header">
                  <strong>{relato.nome}</strong> <span>{relato.tempo}</span>
                </div>
                <p className="relato-texto">{relato.texto}</p>

                {respostasEnviadas[relato.id] && !modoEdicao[relato.id] ? (
                  <div className="resposta-enviada">
                    <strong>Resposta enviada:</strong>
                    <p>{respostasEnviadas[relato.id]}</p>
                    <div className="resposta-acoes">
                      <button onClick={() => handleEditar(relato.id)} className="editar-button">Editar</button>
                      <button onClick={() => handleExcluir(relato.id)} className="excluir-button">Excluir</button>
                    </div>
                  </div>
                ) : modoEdicao[relato.id] ? (
                  <>
                    <textarea
                      className="resposta-textarea"
                      placeholder="Edite sua resposta..."
                      value={respostas[relato.id] || ''}
                      onChange={(e) => handleRespostaChange(relato.id, e.target.value)}
                    />
                    <button
                      className="responder-button"
                      onClick={() => handleSalvarEdicao(relato.id)}
                    >
                      Salvar Edição
                    </button>
                  </>
                ) : (
                  <>
                    <textarea
                      className="resposta-textarea"
                      placeholder="Escreva sua resposta..."
                      value={respostas[relato.id] || ''}
                      onChange={(e) => handleRespostaChange(relato.id, e.target.value)}
                    />
                    <button
                      className="responder-button"
                      onClick={() => handleResponder(relato.id)}
                    >
                      Enviar Resposta
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
