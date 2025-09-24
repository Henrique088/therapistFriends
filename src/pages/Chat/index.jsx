import React, { useEffect, useState, useRef } from 'react';
import MenuLateral from '../../Components/Menu/MenuLateral';
import styles from './Chat.module.css';
import { useSocket } from './../../contexts/SocketContext';
import { useUser } from '../../contexts/UserContext';
import { useChat } from '../../contexts/ChatContext';
import EmojiPicker from '../../Utils/emojiPicker';
import { FaCheckDouble } from "react-icons/fa6";

export default function Chats() {
  const [conversas, setConversas] = useState([]);
  const [mensagens, setMensagens] = useState([]);
  const [conversaSelecionada, setConversaSelecionada] = useState(null);
  const [novaMensagem, setNovaMensagem] = useState('');

  const ultimaMensagemRef = useRef(null);
  const mensagemRefs = useRef(new Map());

  const [menuAberto, setMenuAberto] = useState(null);
  const menuRef = useRef(null);
  const socket = useSocket();
  const { usuario } = useUser();
  const { conversationUnreadCounts, clearUnreadCountForConversation } = useChat();
  const tipo = usuario?.tipo_usuario === 'paciente' ? 'paciente' : 'profissional';


  const rolarParaUltimaMensagem = () => {
    ultimaMensagemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };


  const rolarParaPrimeiraNaoLida = () => {
    const primeiraNaoLida = mensagens.find(msg => !msg.lida && msg.remetente_id !== usuario.id);
    let elementoParaRolar = null;

    if (primeiraNaoLida) {
      elementoParaRolar = mensagemRefs.current.get(primeiraNaoLida.id);
    } else {
      elementoParaRolar = ultimaMensagemRef.current;
    }

    if (elementoParaRolar) {
      elementoParaRolar.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    fetch('http://localhost:3001/conversas', {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setConversas(data);
      })
      .catch((err) => console.error('Erro ao buscar conversas:', err));
  }, []);


  useEffect(() => {
    if (mensagens.length > 0) {
      rolarParaPrimeiraNaoLida();
    }
  }, [mensagens, usuario.id]);


  useEffect(() => {
    const handleClickFora = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAberto(null);
      }
    };
    document.addEventListener('mousedown', handleClickFora);
    return () => {
      document.removeEventListener('mousedown', handleClickFora);
    };
  }, []);

  const toggleMenu = (mensagemId) => {
    setMenuAberto(menuAberto === mensagemId ? null : mensagemId);
  };

  const marcarMensagensComoLidas = async (conversaId) => {
    try {
      await fetch(`http://localhost:3001/mensagens/${conversaId}/lida`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('Erro ao marcar mensagens como lidas:', err);
    }
  };

  const carregarMensagens = async (conversaId) => {
    if (conversaSelecionada === conversaId) return;

    if (conversaSelecionada) {
      socket.emit('sair_conversa', conversaSelecionada);
    }

    socket.emit('entrar_conversa', conversaId);

    try {
      const res = await fetch(`http://localhost:3001/mensagens/${conversaId}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      setMensagens(data.mensagens);
      setConversaSelecionada(conversaId);

      marcarMensagensComoLidas(conversaId);

    } catch (err) {
      console.error('Erro ao buscar mensagens:', err);
    }
  };

  const formatarHora = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (error) {
      console.error("Erro ao formatar hora:", error);
      return 'Erro';
    }
  };

  const handleEmojiSelect = (emoji) => {
    setNovaMensagem(prevMessage => prevMessage + emoji);
  };

  const podeEditarOuDeletar = (enviada_em) => {
    const agora = new Date();
    const enviada = new Date(enviada_em);
    const diffMinutos = (agora - enviada) / 1000 / 60;
    return diffMinutos <= 2;
  };

  const deletarMensagem = (mensagemId) => {
    fetch(`http://localhost:3001/mensagens/${mensagemId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao deletar");
      })
      .catch(err => console.error(err));
  };

  const editarMensagem = (mensagemId, textoAtual) => {
    const novoTexto = prompt("Editar mensagem:", textoAtual);
    if (!novoTexto || novoTexto === textoAtual) return;

    fetch(`http://localhost:3001/mensagens/${mensagemId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto: novoTexto }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao editar");
        return res.json();
      })
      .catch(err => console.error(err));
  };

  const enviarMensagem = () => {
    if (!novaMensagem.trim() || !conversaSelecionada) {
      console.error('Nenhuma conversa selecionada ou mensagem vazia');
      return;
    }

    fetch('http://localhost:3001/mensagens/enviarMensagem', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversa_id: conversaSelecionada,
        texto: novaMensagem,
      }),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.message || 'Erro ao enviar mensagem');
          });
        }
        return response.json();
      })
      .then(msg => {
        setNovaMensagem('');
        rolarParaUltimaMensagem(); // Adicione esta chamada aqui
      })
      .catch(err => {
        console.error('Erro detalhado:', err);
      });
  };

  useEffect(() => {
    const handleNewMessage = (mensagem) => {
      if (mensagem.conversa_id === conversaSelecionada) {
        setMensagens((prev) => {
          const mensagemJaExiste = prev.find(msg => msg.id === mensagem.id);
          if (mensagemJaExiste) return prev;

          return [...prev, mensagem];
        });

        // Solução 1: Marca mensagens como lidas imediatamente se a conversa está aberta
        marcarMensagensComoLidas(conversaSelecionada);
        // Rola para a última mensagem recebida
        rolarParaUltimaMensagem();
      }
    };

    const handleMessagesRead = ({ conversaId, leitorId }) => {
      if (conversaId == conversaSelecionada && leitorId !== usuario.id) {
        setMensagens(prevMensagens =>
          prevMensagens.map(msg => ({
            ...msg,
            lida: true
          }))
        );
      }
    };

    socket.on('nova_mensagem', handleNewMessage);
    socket.on('mensagens_lidas', handleMessagesRead);
    socket.on('connection_error', (err) => {
      console.error('Erro de conexão:', err.message);
    });
    socket.on('edicao_mensagem', (mensagemAtualizada) => {
      setMensagens((prev) =>
        prev.map((msg) =>
          msg.id === mensagemAtualizada.id ? mensagemAtualizada : msg
        )
      );
    });
    socket.on('excluir_mensagem', ({ id }) => {
      setMensagens((prev) => prev.filter((msg) => msg.id !== id));
    });

    return () => {
      socket.off('nova_mensagem', handleNewMessage);
      socket.off('mensagens_lidas', handleMessagesRead);
      socket.off('connection_error');
      socket.off('edicao_mensagem');
      socket.off('excluir_mensagem');
    };
  }, [conversaSelecionada, usuario, socket]);


  const renderizarMensagemComLinks = (texto) => {
  if (!texto) return null;

  // Expressão regular com parênteses de captura para incluir os delimitadores (links) no array
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  
  // O split com parênteses de captura retorna um array com as partes e os delimitadores
  // Ex: "Olá www.google.com!" -> ["Olá ", "www.google.com", "!"]
  const partes = texto.split(urlRegex);

  // Mapeia sobre o array de partes, criando elementos React para cada parte
  return partes.map((parte, index) => {
    // Se a parte for um link
    if (typeof parte === 'string' && parte.match(urlRegex)) {
      const href = parte.startsWith('http') ? parte : `http://${parte}`;
      return <a key={index} href={href} target="_blank" rel="noopener noreferrer">{parte}</a>;
    }
    
    // Se a parte for texto normal, lida com as quebras de linha
    if (typeof parte === 'string') {
      const linhas = parte.split('\n');
      return linhas.map((linha, linhaIndex) => (
        <React.Fragment key={`${index}-${linhaIndex}`}>
          {linha}
          {linhaIndex < linhas.length - 1 && <br />}
        </React.Fragment>
      ));
    }
    
    return parte;
  });
};

  return (
    <div className={styles.container}>
      <MenuLateral></MenuLateral>
      <div className={styles.sidebar}>
        <h2>Conversas</h2>
        <ul className={styles.lista}>
          {Array.isArray(conversas) && conversas.map((conv) => (
            <li
              key={conv.id}
              className={`${styles.item} ${conversaSelecionada === conv.id ? styles.itemSelecionado : ''}`}
              onClick={() => carregarMensagens(conv.id)}
            >
              <div className={styles.conteudoConversa}>
                {usuario.tipo_usuario === "paciente" ? (
                  <span>{conv.profissional.usuario.nome}</span>
                ) : (
                  <span>{conv.paciente.codinome}</span>
                )}
                {conversationUnreadCounts[conv.id] > 0 && (
                  <span className={styles.badge}>{conversationUnreadCounts[conv.id]}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.chatArea}>
        {conversaSelecionada ? (
          <>
            <div className={styles.mensagens}>
              {mensagens.map((msg) => {
                const setRef = (el) => {
                  if (el) {
                    mensagemRefs.current.set(msg.id, el);
                  } else {
                    mensagemRefs.current.delete(msg.id);
                  }
                };
                return (
                  <div key={msg.id} ref={setRef} className={styles.mensagem}>
                    {usuario.id === msg.remetente_id ? (
                      <div className={styles.direita}>
                        <div className={`${styles.mensagem} ${styles.enviada}`}>
                          <div className={styles.mensagemTopo}>
                            <strong><span className={styles.nome}><a href={`perfil-${tipo}`} className={styles.nome_remetente}>{msg.remetente.nome}</a></span></strong>
                            <div className={styles.menuContainer}>
                              {podeEditarOuDeletar(msg.enviada_em) && (
                                <>
                                  <button onClick={() => toggleMenu(msg.id)} className={styles.menuBtn}>⋮</button>
                                  {menuAberto === msg.id && (
                                    <div ref={menuRef} className={styles.popupMenu}>
                                      <button onClick={() => editarMensagem(msg.id, msg.texto)}>Editar</button>
                                      <button onClick={() => deletarMensagem(msg.id)}>Deletar</button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          <div>{renderizarMensagemComLinks(msg.texto)}</div>
                          <div className={styles.mensagemRodape}>
                            {msg.lida && (<span className={styles.lida}><FaCheckDouble/></span>)}
                          <span className={styles.horario}>{formatarHora(msg.enviada_em)}</span>
                          
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.esquerda}>
                        <div className={`${styles.mensagem} ${styles.recebida}`}>
                          <strong><span className={styles.nome_02}><a href='#' className={styles.nome_remetente}>{msg.remetente.nome}</a></span></strong>
                          <div>{renderizarMensagemComLinks(msg.texto)}</div>
                          <span className={styles.horario}>{formatarHora(msg.enviada_em)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={ultimaMensagemRef}></div>
            </div>
            <div className={styles.formEnvio}>
              <EmojiPicker onEmojiSelect={handleEmojiSelect} position="top-center" />
              <textarea
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                placeholder="Digite sua mensagem..."
                className={styles.input}
                onKeyDown={(e) => {
                  // Se a tecla Enter for pressionada E a tecla Shift não estiver pressionada
                  if (e.key === 'Enter' && !e.shiftKey) {
                    // Previne a quebra de linha padrão e envia a mensagem
                    e.preventDefault();
                    enviarMensagem();
                  }
                }}
              />
              <button onClick={enviarMensagem} className={styles.botao} >Enviar</button>
            </div>
          </>
        ) : (
          <p style={{ padding: '20px' }}>Selecione uma conversa para ver as mensagens.</p>
        )}
      </div>
    </div>
  );
}