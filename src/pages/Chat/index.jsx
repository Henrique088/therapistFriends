import React, { useState } from 'react';
import './Chat.css';
import MenuLateral from '../../Components/Menu/MenuLateral';

const conversasFalsas = [
  { id: 1, nome: 'Dra. Ana Oliveira', ultimaMensagem: 'Entendi, podemos conversar melhor amanhã?', horario: '10:15' },
  { id: 2, nome: 'Dr. Carlos Silva', ultimaMensagem: 'Você está melhor hoje?', horario: '09:30' },
];

const mensagensFalsas = {
  1: [
    { remetente: 'profissional', texto: 'Olá, tudo bem? Como posso te ajudar hoje?', horario: '09:00' },
    { remetente: 'paciente', texto: 'Oi, estou passando por momentos difíceis.', horario: '09:05' },
  ],
  2: [
    { remetente: 'profissional', texto: 'Você está melhor hoje?', horario: '08:30' },
    { remetente: 'paciente', texto: 'Um pouco, obrigado por perguntar.', horario: '08:40' },
  ],
};

const Chats = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [conversaSelecionada, setConversaSelecionada] = useState(1);
  const [mensagemNova, setMensagemNova] = useState('');

  const mensagens = mensagensFalsas[conversaSelecionada];

  
  const enviarMensagem = () => {
    if (!mensagemNova.trim()) return;
    mensagensFalsas[conversaSelecionada].push({
      remetente: 'paciente',
      texto: mensagemNova,
      horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    setMensagemNova('');
  };

  return (
    <div className="app-container">
      <MenuLateral collapsed={menuCollapsed} toggleMenu={() => setMenuCollapsed(!menuCollapsed)} />

      <div className={`chat-container ${menuCollapsed ? 'collapsed' : ''}`}>
        <div className="conversas-lista">
          <h2>Conversas</h2>
          {conversasFalsas.map(conversa => (
            <div
              key={conversa.id}
              className={`conversa-card ${conversa.id === conversaSelecionada ? 'ativa' : ''}`}
              onClick={() => setConversaSelecionada(conversa.id)}
            >
              <div className="avatar">{conversa.nome.charAt(0)}</div>
              <div className="info">
                <div className="nome">{conversa.nome}</div>
                <div className="ultima">{conversa.ultimaMensagem}</div>
              </div>
              <div className="horario">{conversa.horario}</div>
            </div>
          ))}
        </div>

        <div className="chat-area">
          <div className="mensagens">
            {mensagens.map((msg, index) => (
              <div
                key={index}
                className={`mensagem ${msg.remetente === 'paciente' ? 'enviada' : 'recebida'}`}
              >
                <div className="texto">{msg.texto}</div>
                <div className="horario">{msg.horario}</div>
              </div>
            ))}
          </div>

          <div className="entrada-mensagem">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              value={mensagemNova}
              onChange={(e) => setMensagemNova(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
            />
            <button onClick={enviarMensagem}>Enviar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chats;
