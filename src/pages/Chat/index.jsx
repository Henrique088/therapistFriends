import React, { useEffect, useState, useRef } from 'react';
import MenuLateral from '../../Components/Menu/MenuLateral';
import styles from './Chat.module.css';
import { useSocket } from './../../contexts/SocketContext';
import { useUser } from '../../contexts/UserContext';
import { useChat } from '../../contexts/ChatContext';
import EmojiPicker from '../../Utils/emojiPicker';
import { FaCheckDouble } from "react-icons/fa6";
import { IoArrowBackCircleOutline } from "react-icons/io5"; 
import api from '../../api/apiConfig';

export default function Chats() {
  const [conversas, setConversas] = useState([]);
  const [mensagens, setMensagens] = useState([]);
  const [conversaSelecionada, setConversaSelecionada] = useState(null);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  const ultimaMensagemRef = useRef(null);
  const mensagemRefs = useRef(new Map());

  const [menuAberto, setMenuAberto] = useState(null);
  const menuRef = useRef(null);
  const socket = useSocket();
  const { usuario } = useUser();
  const { conversationUnreadCounts, clearUnreadCountForConversation } = useChat();
  const tipo = usuario?.tipo_usuario === 'paciente' ? 'paciente' : 'profissional';

  const chatAreaRef = useRef(null);


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
    const fetchConversas = async () => {
      try {
        const response = await api.get('/conversas');
        setConversas(response.data);
      } catch (error) {
        console.error('Erro ao buscar conversas:', error.response?.data || error.message);
      }
    };

    fetchConversas();
  }, []);

  
  useEffect(() => {
   
    const ajustarTeclado = () => {

     
      const formEnvioEl = document.getElementsByClassName(styles.formEnvio)[0];
      const chatHeaderEl = document.getElementsByClassName(styles.chatHeader)[0];

      const chatArea = chatAreaRef.current;

      if (!formEnvioEl || !window.visualViewport || !chatArea || !chatHeaderEl || !conversaSelecionada) {
        resetAltura();
        return;
      }

      // 1. Calcular alturas
      const alturaTeclado = window.innerHeight - window.visualViewport.height;
      const alturaForm = formEnvioEl.offsetHeight;
      const alturaHeader = chatHeaderEl.offsetHeight;

      const alturaVisivel = window.visualViewport.height;

      // 2. Mover o Formulário de Envio (colando no topo do teclado)
      formEnvioEl.style.bottom = `${alturaTeclado}px`;

      // Altura da Mensagens = Altura Visível - Altura do Header - Altura do Form.
      chatArea.style.height = `${alturaVisivel - alturaHeader - alturaForm}px`;

      // 4. Forçar Rolagem
      const rolarAoFim = () => {
        chatArea.scrollTop = chatArea.scrollHeight;
      };

      requestAnimationFrame(rolarAoFim);
      setTimeout(rolarAoFim, 50);
    };

    // Função para resetar as alturas quando o teclado fechar
    const resetAltura = () => {
      const chatArea = chatAreaRef.current;

      const formEnvioEl = document.getElementsByClassName(styles.formEnvio)[0];

      if (chatArea) {
        
        chatArea.style.height = 'auto';
        chatArea.style.flex = '1';
      }
      if (formEnvioEl) {
        formEnvioEl.style.bottom = '0';
      }
    }


    // REGISTRO DOS LISTENERS 
    window.visualViewport?.addEventListener('resize', ajustarTeclado);
    window.addEventListener('focusin', ajustarTeclado);
    window.addEventListener('focusout', resetAltura);


    // FUNÇÃO DE LIMPEZA
    return () => {
      window.visualViewport?.removeEventListener('resize', ajustarTeclado);
      window.removeEventListener('focusin', ajustarTeclado);
      window.removeEventListener('focusout', resetAltura);
    };
   
  }, [styles, conversaSelecionada]); 
  


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
      await api.put(`/mensagens/${conversaId}/lida`);
    } catch (error) {
      console.error('Erro ao marcar mensagens como lidas:', error.response?.data || error.message);
    }
  };

  const carregarMensagens = async (conversaId) => {
    if (conversaSelecionada) {
      socket.emit('sair_conversa', conversaSelecionada);
    }

    socket.emit('entrar_conversa', conversaId);

    try {
      const response = await api.get(`/mensagens/${conversaId}`);

      setMensagens(response.data.mensagens);
      setConversaSelecionada(conversaId);
      clearUnreadCountForConversation(conversaId); // Limpa o contador no Context

      marcarMensagensComoLidas(conversaId);

    } catch (error) {
      console.error('Erro ao buscar mensagens:', error.response?.data || error.message);
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

  const deletarMensagem = async (mensagemId) => {
    try {
      await api.delete(`/mensagens/${mensagemId}`);
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error.response?.data || error.message);
    }
  };

  const editarMensagem = async (mensagemId, textoAtual) => {
    const novoTexto = prompt("Editar mensagem:", textoAtual);
    if (!novoTexto || novoTexto === textoAtual) return;

    try {
      await api.put(`/mensagens/${mensagemId}`, { texto: novoTexto });
    } catch (error) {
      console.error('Erro ao editar mensagem:', error.response?.data || error.message);
    }
  };

  const enviarMensagem = async () => {
    if (!novaMensagem.trim() || !conversaSelecionada) {
      console.error('Nenhuma conversa selecionada ou mensagem vazia');
      return;
    }

    setLoading(true);
    try {
      await api.post('/mensagens/enviarMensagem', {
        conversa_id: conversaSelecionada,
        texto: novaMensagem,
      });

      setNovaMensagem('');
      rolarParaUltimaMensagem();

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleNewMessage = (mensagem) => {
      if (mensagem.conversa_id === conversaSelecionada) {
        setMensagens((prev) => {
          const mensagemJaExiste = prev.find(msg => msg.id === mensagem.id);
          if (mensagemJaExiste) return prev;

          return [...prev, mensagem];
        });

        marcarMensagensComoLidas(conversaSelecionada);
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

    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    const partes = texto.split(urlRegex);

    return partes.map((parte, index) => {
      if (typeof parte === 'string' && parte.match(urlRegex)) {
        const href = parte.startsWith('http') ? parte : `http://${parte}`;
        return <a key={index} href={href} target="_blank" rel="noopener noreferrer">{parte}</a>;
      }

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

  
  const deselecionarConversa = () => {
    if (conversaSelecionada) {
      socket.emit('sair_conversa', conversaSelecionada);
    }
    setConversaSelecionada(null);
    setMensagens([]);
  };


  return (
    <div className={`${styles.container} ${conversaSelecionada ? styles.chatAtivoMobile : ''}`}>
      <MenuLateral></MenuLateral>

      {/* SIDEBAR (LISTA DE CONVERSAS) */}
      <div className={`${styles.sidebar} ${conversaSelecionada ? styles.ocultarMobile : ''}`}>
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

      {/* ÁREA DO CHAT */}
      <div className={`${styles.chatArea} ${!conversaSelecionada ? styles.ocultarMobile : ''}`}>
        {conversaSelecionada ? (
          <>
            <div className={styles.chatHeader}>
              <button onClick={deselecionarConversa} className={styles.voltarBtn}>
                <IoArrowBackCircleOutline />
              </button>
              <h3>
                {conversas.find(c => c.id === conversaSelecionada)
                  ? (usuario.tipo_usuario === "paciente"
                    ? conversas.find(c => c.id === conversaSelecionada).profissional.usuario.nome
                    : conversas.find(c => c.id === conversaSelecionada).paciente.codinome)
                  : 'Chat'}
              </h3>
            </div>

            <div className={styles.mensagens} ref={chatAreaRef}>
              {mensagens.map((msg) => {
                const setRef = (el) => {
                  if (el) {
                    mensagemRefs.current.set(msg.id, el);
                  } else {
                    mensagemRefs.current.delete(msg.id);
                  }
                };
                return (
                  <div
                    key={msg.id}
                    ref={setRef}
                    className={`${styles.mensagem} ${usuario.id === msg.remetente_id ? styles.enviada : styles.recebida}`}
                  >
                    <div className={styles.mensagemTopo}>
                      <strong>
                        <span className={usuario.id === msg.remetente_id ? styles.nome : styles.nome_02}>
                          <a href={usuario.id === msg.remetente_id ? `perfil-${tipo}` : '#'} className={styles.nome_remetente}>
                            {msg.remetente.nome}
                          </a>
                        </span>
                      </strong>
                      <div className={styles.menuContainer}>
                        {usuario.id === msg.remetente_id && podeEditarOuDeletar(msg.enviada_em) && (
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
                      {usuario.id === msg.remetente_id && msg.lida && (<span className={styles.lida}><FaCheckDouble /></span>)}
                      <span className={styles.horario}>{formatarHora(msg.enviada_em)}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={ultimaMensagemRef}></div>
            </div>
            <div className={styles.formEnvio}>
              <EmojiPicker onEmojiSelect={handleEmojiSelect} position="center" />
              <textarea
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                placeholder="Digite sua mensagem..."
                className={styles.input}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    enviarMensagem();
                  }
                }}
                disabled={loading}
              />
              <button
                onClick={enviarMensagem}
                className={styles.botao}
                disabled={loading || !novaMensagem.trim()}
              >
                {loading ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </>
        ) : (
          <p style={{ padding: '20px' }}>Selecione uma conversa para ver as mensagens.</p>
        )}
      </div>
    </div>
  );
}