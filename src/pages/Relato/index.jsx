import React, { useState, useEffect } from 'react';
import './Relatos.css';
import MenuLateral from '../../Components/Menu/MenuLateral';
import ExibirRelatos from '../../Components/Relatos/RelatosComponente';
import RelatoForm from '../../Components/FormularioRelatos/FormularioRelatos';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '../../contexts/UserContext';
import {formatarData} from '../../Utils';
const Relatos = () => {

  const [showForm, setShowForm] = useState(false);
  const [relato, setRelato] = useState();
  const { usuario } = useUser();
  
  useEffect(() => {
    fetch('http://localhost:3001/relatos/', {
      headers: {
        'Content-Type': 'application/json',
         
      },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {


        setRelato(data);
        console.log('Relatos:', JSON.stringify(data, null, 2));
      })
      .catch((err) => console.error('Erro ao buscar relatos:', err));
  }, []);

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
        {usuario?.tipo_usuario === 'paciente' && (
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

        {/* <div className="relatos-feed">
          {Array.isArray(relato) && relato.map((relatos) => (
            <div key={relatos.id} className="relato-card">
              <div className="relato-info">

                <h3>{relatos.titulo}</h3>
                <h4>Categoria: {relatos.categoria}</h4>

              </div>
              <p>{relatos.texto}</p>
              <div className="relato-info">
                <span>{relatos.paciente.codinome}</span>
                <span>{formatarData(relatos?.data_envio)}</span>
              </div>
            </div>
          ))}
        </div> */}
        <ExibirRelatos numRelatos={0} />
      </div>
    </div>
  );
};

export default Relatos;
