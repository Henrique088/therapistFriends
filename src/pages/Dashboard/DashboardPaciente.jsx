import React, { useState } from 'react';
import './App.css';
import MenuLateral from '../../Components/Menu/MenuLateral';
import RelatoForm from '../../Components/FormularioRelatos/FormularioRelatos';
// import ModalCodinome from '../../Components/ModalCodinome/ModalCodinome';
import { jwtDecode } from "jwt-decode";


export default function DashboardPaciente () {
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const codinome = useState(decoded.codinome || '');
  const [showForm, setShowForm] = useState(false);
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
      likes: 32,
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
    console.log('Formulário cancelado');
    
  };

  const handleSubmit = (formData) => {
    
    console.log('Dados do relato:', formData);
    setShowForm(false);
    
  };
  

  const createNewPost = () => {
    setShowForm(true);
    // setPosts([newPost, ...posts]);
  };

  

  return (
    <div className="app">
     <MenuLateral></MenuLateral>
      
      {/* {{codinome} && <ModalCodinome/>} */}
      {/* Conteúdo Principal */}
      <div className="main-content">
        <div className="content-header">
          <h1>Bem vindo, Henrique</h1>
          <button className="create-post-button" onClick={createNewPost}>
            + Criar Desabafo
          </button>

        </div>
        {showForm && <RelatoForm onCancel={handleCancel} onSubmit={handleSubmit}/>}
        {/* Lista de Desabafos */}
        <h2>Feed</h2>
        <div className="posts-container">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="user-avatar">{post.user.substring(0, 2)}</div>
                <div className="user-info">
                  <div className="username">{post.user}</div>
                  <div className="post-time">{post.time}</div>
                </div>
              </div>
              <div className="post-content">
                {post.content}
              </div>
              <div className="post-actions">
                <button className="like-button">👍 {post.likes}</button>
                <button className="comment-button">💬 {post.comments}</button>
                <button className="share-button">↗️ Compartilhar</button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Cards Informativos */}
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
};

