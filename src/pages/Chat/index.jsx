import React, { useEffect, useState } from 'react';
import MenuLateral from '../../Components/Menu/MenuLateral';

export default function Chats() {
  const [conversas, setConversas] = useState([]);
  const [mensagens, setMensagens] = useState([]);
  const [conversaSelecionada, setConversaSelecionada] = useState(null);
  const [novaMensagem, setNovaMensagem] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:3001/conversas', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('conversas:'+ data)
        setConversas(data);
      })
      .catch((err) => console.error('Erro ao buscar conversas:', err));
  }, [token]);

  const carregarMensagens = (conversaId) => {
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
    setMensagens(prev => [...prev, msg]);
    setNovaMensagem('');
  })
  .catch(err => {
    console.error('Erro detalhado:', err);
    
  });
};

  return (

    
    <div style={styles.container}>
      <MenuLateral></MenuLateral>
      <div style={styles.sidebar}>
        <h2>Conversas</h2>
        <ul style={styles.lista}>
          {Array.isArray(conversas) && conversas.map((conv) => (
            <li
              key={conv.id}
              style={{
                ...styles.item,
                backgroundColor: conversaSelecionada === conv.id ? '#e0ffe0' : '#fff',
              }}
              onClick={() => carregarMensagens(conv.id)}
            >
              Conversa #{conv.id}
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.chatArea}>
        {conversaSelecionada ? (
          <>
            <div style={styles.mensagens}>
              {mensagens.map((msg) => (
                <div key={msg.id} style={styles.mensagem}>
                  <strong>{msg.remetente_id}:</strong> {msg.texto}
                </div>
              ))}
            </div>
            <div style={styles.formEnvio}>
              <input
                type="text"
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                placeholder="Digite sua mensagem..."
                style={styles.input}
              />
              <button onClick={enviarMensagem} style={styles.botao}>Enviar</button>
            </div>
          </>
        ) : (
          <p style={{ padding: '20px' }}>Selecione uma conversa para ver as mensagens.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  sidebar: {
    width: '30%',
    borderRight: '1px solid #ccc',
    padding: '10px',
    overflowY: 'auto',
    backgroundColor: '#f8f8f8',
  },
  lista: {
    listStyle: 'none',
    padding: 0,
  },
  item: {
    padding: '10px',
    marginBottom: '5px',
    cursor: 'pointer',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  mensagens: {
    flex: 1,
    padding: '10px',
    overflowY: 'auto',
    backgroundColor: '#f0f0f0',
  },
  mensagem: {
    padding: '8px',
    marginBottom: '5px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  formEnvio: {
    display: 'flex',
    borderTop: '1px solid #ccc',
    padding: '10px',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginRight: '10px',
  },
  botao: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#0fd850',
    color: '#000',
    cursor: 'pointer',
  },
};
