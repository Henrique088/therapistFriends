import React, { useEffect, useState, useRef } from 'react';
import MenuLateral from '../../Components/Menu/MenuLateral';
import { jwtDecode } from "jwt-decode";
import styles from './Chat.module.css';
import { io } from 'socket.io-client';


const socket = io('http://localhost:3001', {
  auth: {
    token: localStorage.getItem('token')
  },
  withCredentials: true
});



export default function Chats() {
  const [conversas, setConversas] = useState([]);
  const [mensagens, setMensagens] = useState([]);
  const [conversaSelecionada, setConversaSelecionada] = useState(null);
  const [novaMensagem, setNovaMensagem] = useState('');
  const mensagensRef = useRef(null);
  const [menuAberto, setMenuAberto] = useState(null);

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token)
  const tipo_usuario = decoded.tipo_usuario;
  const id_usuario = decoded.id;

  useEffect(() => {
    fetch('http://localhost:3001/conversas', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {


        setConversas(data);
        console.log('Conversas:', JSON.stringify(data, null, 2));
      })
      .catch((err) => console.error('Erro ao buscar conversas:', err));
  }, [token]);

  useEffect(() => {
    if (mensagensRef.current) {
      mensagensRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensagens]);


  const toggleMenu = (mensagemId) => {
    setMenuAberto(menuAberto === mensagemId ? null : mensagemId);
  };
  const carregarMensagens = (conversaId) => {
    socket.emit('entrar_conversa', conversaId);
    console.log(conversaId)
    fetch(`http://localhost:3001/mensagens/${conversaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setMensagens(data);
        setConversaSelecionada(conversaId);
      })
      .catch((err) => console.error('Erro ao buscar mensagens:', err));
  };

  const formatarHora = (isoString) => {
    if (!isoString) {
      return '';
    }
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

  const podeEditarOuDeletar = (enviada_em) => {
    const agora = new Date();
    const enviada = new Date(enviada_em);
    const diffMinutos = (agora - enviada) / 1000 / 60;

    return diffMinutos <= 2; // por exemplo, 2 minutos
  };
  const deletarMensagem = (mensagemId) => {
    fetch(`http://localhost:3001/mensagens/${mensagemId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao deletar");
        setMensagens(prev => prev.filter(msg => msg.id !== mensagemId));
      })
      .catch(err => console.error(err));
  };

  const editarMensagem = (mensagemId, textoAtual) => {
    const novoTexto = prompt("Editar mensagem:", textoAtual);
    if (!novoTexto || novoTexto === textoAtual) return;

    fetch(`http://localhost:3001/mensagens/${mensagemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ texto: novoTexto }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao editar");
        return res.json();
      })
      .then(mensagemAtualizada => {
        setMensagens(prev =>
          prev.map(msg => (msg.id === mensagemId ? mensagemAtualizada : msg))
        );
      })
      .catch(err => console.error(err));
  };

  const enviarMensagem = () => {
    if (!novaMensagem.trim()) return;

    if (!conversaSelecionada) {
      console.error('Nenhuma conversa selecionada');
      return;
    }

    fetch('http://localhost:3001/mensagens/enviarMensagem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
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
        // setMensagens(prev => [...prev, msg]);
        setNovaMensagem('');
        console.log('Mensagem enviada:', msg);
        // socket.emit('novaMensagem', msg);
      })
      .catch(err => {
        console.error('Erro detalhado:', err);

      });
  };
  useEffect(() => {
    socket.on('nova_mensagem', (mensagem) => {
      if (mensagem.conversa_id === conversaSelecionada) {
        setMensagens((prev) => [...prev, mensagem]);


      }


    });

    socket.on('connection_error', (err) => {
      console.error('Erro de conexão:', err.message);
    });

    return () => {
      socket.off('mensagemRecebida');
    };
  }, [conversaSelecionada]);


  return (


    <div className={styles.container}>
      <MenuLateral></MenuLateral>
      <div className={styles.sidebar}>
        <h2>Conversas</h2>
        <ul className={styles.lista}>
          {tipo_usuario === "paciente" ? (
            // Renderização para Paciente
            Array.isArray(conversas) && conversas.map((conv) => (
              <li
                key={conv.id}
                className={styles.item}
                style={{

                  backgroundColor: conversaSelecionada === conv.id ? '#e0ffe0' : '#fff',
                }}
                onClick={() => carregarMensagens(conv.id)}
              >
                Conversa #{conv.profissional.usuario.nome}
              </li>
            ))
          ) : (
            // Renderização para outros tipos de usuário
            Array.isArray(conversas) && conversas.map((conv) => (
              <li
                key={conv.id}
                className={styles.item}

                style={{

                  backgroundColor: conversaSelecionada === conv.id ? '#e0ffe0' : '#fff',
                }}
                onClick={() => carregarMensagens(conv.id)}
              >
                {conv.paciente.codinome}
              </li>
            ))
          )}
        </ul>
      </div>

      <div className={styles.chatArea}>
        {conversaSelecionada ? (
          <>
            <div className={styles.mensagens}>
              {mensagens.map((msg) => (
                <div key={msg.id} className={styles.mensagem}>
                  {id_usuario === msg.remetente_id ? (
                    <div className={styles.direita}>
                      <div className={`${styles.mensagem} ${styles.enviada}`}>
                        <div className={styles.mensagemTopo}>
                          <strong><span className={styles.nome}>{msg.remetente.nome}</span></strong>
                          <div className={styles.menuContainer}>
                            {podeEditarOuDeletar(msg.enviada_em) && (
                              <>
                                <button onClick={() => toggleMenu(msg.id)} className={styles.menuBtn}>⋮</button>
                                {menuAberto === msg.id && (
                                  <div className={styles.popupMenu}>
                                    <button onClick={() => editarMensagem(msg.id, msg.texto)}>Editar</button>
                                    <button onClick={() => deletarMensagem(msg.id)}>Deletar</button>
                                  </div>
                                )}
                              </>
                            )}

                          </div>
                        </div>
                        <div>{msg.texto}</div>
                        <span className={styles.horario}>{formatarHora(msg.enviada_em)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.esquerda}>
                      <div className={`${styles.mensagem} ${styles.recebida}`}>
                        <strong><span className={styles.nome_02}>{msg.remetente.nome}</span></strong>
                        <div>{msg.texto}</div>
                        <span className={styles.horario}>{formatarHora(msg.enviada_em)}</span>
                      </div>
                    </div>
                  )}
                </div>

              ))}
              {/* marcador de rolagem */}
              <div ref={mensagensRef}></div>
            </div>
            <div className={styles.formEnvio}>
              <input
                type="text"
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                placeholder="Digite sua mensagem..."
                className={styles.input}
              />
              <button onClick={enviarMensagem} className={styles.botao}>Enviar</button>
            </div>
          </>
        ) : (
          <p style={{ padding: '20px' }}>Selecione uma conversa para ver as mensagens.</p>
        )}
      </div>
    </div>
  );
}

// const styles = {
//   container: {
//     display: 'flex',
//     height: '100vh',
//     fontFamily: 'Arial, sans-serif',
//   },
//   sidebar: {
//     width: '20%',
//     borderRight: '1px solid #ccc',
//     padding: '10px',
//     overflowY: 'auto',
//     backgroundColor: '#f8f8f8',


//   },
//   lista: {
//     listStyle: 'none',
//     padding: 0,

//   },
//   item: {
//     padding: '10px',
//     marginBottom: '5px',
//     cursor: 'pointer',
//     borderRadius: '5px',
//     border: '1px solid #ccc',
//   },
//   chatArea: {
//     flex: 1,
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   mensagens: {
//     flex: 1,
//     padding: '10px',
//     overflowY: 'auto',
//     backgroundColor: '#f0f0f0',
//   },
//   mensagem: {
//     // position: 'relative',
//     width: '100%',
//     display: 'flex',
//     flexDirection: 'column',
//     padding: '8px',
//     marginBottom: '5px',
//     backgroundColor: '#fff',
//     borderRadius: '5px',
//     border: '1px solid #ddd',
//   },
//   formEnvio: {
//     display: 'flex',
//     borderTop: '1px solid #ccc',
//     padding: '10px',
//     backgroundColor: '#fff',
//   },
//   input: {
//     flex: 1,
//     padding: '10px',
//     borderRadius: '5px',
//     border: '1px solid #ccc',
//     marginRight: '10px',
//   },
//   botao: {
//     padding: '10px 20px',
//     borderRadius: '5px',
//     border: 'none',
//     backgroundColor: '#0fd850',
//     color: '#000',
//     cursor: 'pointer',
//   },

// };
