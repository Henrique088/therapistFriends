import React, { useState, useEffect } from 'react';
import './App.css';
import MenuLateral from '../../Components/Menu/MenuLateral';
import RelatoForm from '../../Components/FormularioRelatos/FormularioRelatos';
import ModalCodinome from '../../Components/ModalCodinome/ModalCodinome';

import { useUsuario } from '../../contexts/UserContext';

export default function DashboardPaciente() {


  const [showForm, setShowForm] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [relato, setRelato] = useState([]);
  // const [codinome, setCodinome] = useState(infos.codinome || '');
  // console.log(infos.codinome);
  const { usuario } = useUsuario();
  // console.log(usuario);

 useEffect(() => {
     fetch('http://localhost:3001/relatos/', {
       headers: {
         'Content-Type': 'application/json',
          
       },
       credentials: 'include',
     })
       .then((res) => res.json())
       .then((data) => {
        const relatosRecentes = data
        .sort((a, b) => new Date(b.data_envio) - new Date(a.data_envio)) 
        .slice(0, 3); 
 
         setRelato(relatosRecentes);
         console.log('Relatos:', JSON.stringify(data, null, 2));
       })
       .catch((err) => console.error('Erro ao buscar relatos:', err));
   }, []);



  if (!usuario.codinome) setMostrarModal(true);


  const [posts, setPosts] = useState([
    {
      id: 1,
      user: 'João Silva',
      content: 'Hoje foi um dia difícil no trabalho, mas consegui resolver todos os problemas!',
      time: '2 horas atrás',
      likes: 15,
      comments: 5
    },
    {
      id: 2,
      user: 'Maria Oliveira',
      content: 'Precisando de um conselho: como vocês lidam com a ansiedade antes de apresentações importantes?',
      time: '5 horas atrás',
      
      comments: 12
    },
    {
      id: 3,
      user: 'Carlos Souza',
      content: 'Finalmente terminei meu projeto pessoal depois de 3 meses trabalhando nele! Que sensação incrível!',
      time: '1 dia atrás',
      likes: 45,
      comments: 8
    }
  ]);

  const infoCards = [
    {
      title: 'Dica do Dia',
      content: 'Respire fundo por 4 segundos, segure por 7 e expire por 8. Isso ajuda a reduzir a ansiedade.'
    },
    {
      title: 'Estatísticas',
      content: '85% das pessoas se sentem melhor depois de compartilhar seus sentimentos.'
    },
    {
      title: 'Suporte',
      content: 'Se estiver passando por momentos difíceis, não hesite em buscar ajuda profissional.'
    }
  ];

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleSubmit = (formData) => {
    console.log('Dados do relato:', formData);
    setShowForm(false);
  };

  const createNewPost = () => {
    setShowForm(true);
  };

  return (
    <div className="app">
      <MenuLateral />

      {mostrarModal && (
        <ModalCodinome
          visible={mostrarModal}
          onClose={() => setMostrarModal(false)}
        />
      )}

      <div className="main-content">
        <div className="content-header">
          <h1>Bem-vindo, {usuario?.codinome || 'Paciente'}</h1>
          <button className="create-post-button" onClick={createNewPost}>
            + Criar Desabafo
          </button>
        </div>

        {showForm && <RelatoForm onCancel={handleCancel} onSubmit={handleSubmit} />}

        <h2>Feed</h2>
        <div className="posts-container">
          {relato.map(relatos => (
            <div key={relatos.id} className="post-card">
              <div className="post-header">
                <div className="user-avatar">{relatos?.paciente.codinome.substring(0, 2)}</div>
                <div className="user-info">
                  <div className="username">{relatos?.paciente.codinome}</div>
                  <div className="post-time">{relatos?.data_envio}</div>
                </div>
              </div>
              <div className="post-content">{relatos?.texto}</div>
              <div className="post-actions">
                <button className="like-button">👍 {relatos?.likes || 0}</button>
                
              </div>
            </div>
          ))}
        </div>

        <div className="info-cards-container">
          {infoCards.map((card, index) => (
            <div key={index} className="info-card">
              <h3>{card.title}</h3>
              <p>{card.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
