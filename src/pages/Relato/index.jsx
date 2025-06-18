import React, { useState, useEffect } from 'react';
import './Relatos.css';
import MenuLateral from '../../Components/Menu/MenuLateral';
import RelatoForm from '../../Components/FormularioRelatos/FormularioRelatos';
import { jwtDecode } from 'jwt-decode';

const Relatos = () => {

  const [showForm, setShowForm] = useState(false);
  const [relato, setRelato] = useState();
  const [relatos, setRelatos] = useState([
    {
      id: 1,
      autor: 'Anônimo',
      titulo: 'Ansiedade no trabalho',
      texto: 'Tenho enfrentado muitos desafios no ambiente de trabalho e isso tem me deixado ansioso todos os dias.',
      data: 'Há 2 dias'
    },
    {
      id: 2,
      autor: 'Anônimo',
      titulo: 'Dificuldade para dormir',
      texto: 'Há semanas não consigo dormir direito. Minha mente não para, e acordo sempre cansado.',
      data: 'Há 5 dias'
    }
  ]);

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token)
  const tipo_usuario = decoded.tipo_usuario;
  const id_usuario = decoded.id;

  useEffect(() => {
    fetch('http://localhost:3001/relatos', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {


        setRelato(data);
        console.log('Relatos:', JSON.stringify(data, null, 2));
      })
      .catch((err) => console.error('Erro ao buscar conversas:', err));
  }, [token]);

  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');

  // const adicionarRelato = () => {
  //   if (titulo.trim() && texto.trim()) {
  //     const novoRelato = {
  //       id: relatos.length + 1,
  //       autor: 'Você',
  //       titulo,
  //       texto,
  //       data: 'Agora mesmo'
  //     };
  //     setRelatos([novoRelato, ...relatos]);
  //     setTitulo('');
  //     setTexto('');
  //   }
  // };

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
    <div className="app-container">
      <MenuLateral />


      <div className="main-content">
        <h1 className="titulo-pagina">Relatos da Comunidade</h1>
        {tipo_usuario === 'paciente' && (
          <button className="create-post-button" onClick={createNewPost}>
            + Criar Desabafo
          </button>

        )}
        {showForm && <RelatoForm onCancel={handleCancel} onSubmit={handleSubmit} />}
        {/* <div className="relato-form">
          <input
            type="text"
            placeholder="Título do seu relato"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="input-relato"
          />
          <textarea
            placeholder="Conte seu relato de forma anônima..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="textarea-relato"
          />
          <button onClick={adicionarRelato} className="botao-enviar-relato">
            Enviar Relato
          </button>
        </div> */}

        <div className="relatos-feed">
          {Array.isArray(relato) && relato.map((relatos) => (
            <div key={relatos.id} className="relato-card">
              <div className="relato-info">

                <h3>{relatos.titulo}</h3>
                <h4>Categoria: {relatos.categoria}</h4>

              </div>
              <p>{relatos.texto}</p>
              <div className="relato-info">
                <span>{relatos.paciente.codinome}</span>
                <span>{relatos.data_envio}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Relatos;
