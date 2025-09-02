import React, { useState, useEffect } from 'react';
import './App.css';
import MenuLateral from '../../Components/Menu/MenuLateral';
import ExibirRelatos from '../../Components/Relatos/RelatosComponente';
import MyCalendar from '../Calendario';
import RelatoForm from '../../Components/FormularioRelatos/FormularioRelatos';
import { useUser } from '../../contexts/UserContext';

export default function DashboardPaciente() {

  const [mostrarModal, setMostrarModal] = useState(false);
  const { usuario } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [recarregarRelatos, setRecarregarRelatos] = useState(0);

  useEffect(() => {
    if (!usuario?.codinome) {
      setMostrarModal(true);
    }
  }, [usuario?.codinome]);

  const infoCards = [
    {
      title: 'Dica do Dia',
      content: 'Respire fundo por 4 segundos, segure por 7 e expire por 8. Isso ajuda a reduzir a ansiedade.',
    },
    {
      title: 'Estatísticas',
      content: '85% das pessoas se sentem melhor depois de compartilhar seus sentimentos.',
    },
    {
      title: 'Suporte',
      content: 'Se estiver passando por momentos difíceis, não hesite em buscar ajuda profissional.',
    },
  ];

  const handleCancel = () => {
    setShowForm(false);
    console.log('Formulário cancelado');

  };

  const handleSubmit = (formData) => {
    setRecarregarRelatos(prev => prev + 1);
    console.log('Dados do relato:', formData);
    setShowForm(false);

  };


  const createNewPost = () => {
    setShowForm(true);
  };

  return (
    <div className="app">
      <MenuLateral />

      {showForm && <RelatoForm onCancel={handleCancel} onSubmit={handleSubmit}  />}
     
      
      <div className="main-content">
        <div className="content-header">
          <h1>Bem-vindo, {usuario?.codinome || 'Paciente'}</h1>
          <button className="create-post-button" onClick={createNewPost}>
            + Criar Desabafo
          </button>
        </div>

       

        <h2>Relatos Recentes</h2>
       
       <ExibirRelatos numRelatos={3} recarregar={recarregarRelatos}/>

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
