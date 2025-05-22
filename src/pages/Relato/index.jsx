import React, { useState } from 'react';
import './Relatos.css';
import MenuLateral from '../../Components/Menu/MenuLateral';

const Relatos = () => {
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

  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');

  const adicionarRelato = () => {
    if (titulo.trim() && texto.trim()) {
      const novoRelato = {
        id: relatos.length + 1,
        autor: 'Você',
        titulo,
        texto,
        data: 'Agora mesmo'
      };
      setRelatos([novoRelato, ...relatos]);
      setTitulo('');
      setTexto('');
    }
  };

  return (
    <div className="app-container">
      <MenuLateral />

      <div className="main-content">
        <h1 className="titulo-pagina">Relatos da Comunidade</h1>

        <div className="relato-form">
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
        </div>

        <div className="relatos-feed">
          {relatos.map((relato) => (
            <div key={relato.id} className="relato-card">
              <h3>{relato.titulo}</h3>
              <p>{relato.texto}</p>
              <div className="relato-info">
                <span>{relato.autor}</span>
                <span>{relato.data}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Relatos;
