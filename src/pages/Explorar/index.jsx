import React, { useState } from 'react';
import './Explorar.css';
import MenuLateral from '../../Components/Menu/MenuLateral';

const Explorar = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [profissionalSelecionado, setProfissionalSelecionado] = useState(null);

  const toggleMenu = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  const handlePesquisaChange = (e) => {
    setTermoPesquisa(e.target.value);
  };

  const profissionais = [
    {
      id: 1,
      nome: 'Dr. Carlos Silva',
      especialidade: 'Psicólogo',
      avaliacao: 4.8,
      bio: 'Especialista em terapia cognitivo-comportamental com mais de 10 anos de experiência.',
    },
    {
      id: 2,
      nome: 'Dra. Ana Oliveira',
      especialidade: 'Psiquiatra',
      avaliacao: 4.9,
      bio: 'Psiquiatra formada pela UFMG, com atuação voltada ao tratamento de ansiedade e depressão.',
    },
    {
      id: 3,
      nome: 'Dr. Marcos Souza',
      especialidade: 'Terapeuta',
      avaliacao: 4.7,
      bio: 'Terapeuta humanista com foco em escuta ativa e acolhimento empático.',
    },
  ];

  const profissionaisFiltrados = profissionais.filter((prof) =>
    prof.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
    prof.especialidade.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  return (
    <div className="app-container">
      <MenuLateral collapsed={menuCollapsed} toggleMenu={toggleMenu} />

      <div className={`main-content ${menuCollapsed ? 'collapsed' : ''}`}>
        <div className="abas-header">
          <h2>Explorar Profissionais</h2>

          <div className="search-container">
            <input
              type="text"
              placeholder="Pesquisar profissionais..."
              value={termoPesquisa}
              onChange={handlePesquisaChange}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="profissionais-list">
          {profissionaisFiltrados.length > 0 ? (
            profissionaisFiltrados.map((prof) => (
              <div key={prof.id} className="profissional-card">
                <div className="profissional-avatar">{prof.nome.charAt(0)}</div>
                <div className="profissional-info">
                  <h3>{prof.nome}</h3>
                  <p>{prof.especialidade}</p>
                  <div className="profissional-avaliacao">
                    {'★'.repeat(Math.floor(prof.avaliacao))}
                    {'☆'.repeat(5 - Math.floor(prof.avaliacao))}
                    <span> ({prof.avaliacao})</span>
                  </div>
                </div>
                <button onClick={() => setProfissionalSelecionado(prof)} className="agendar-button">
                  Ver Perfil Completo
                </button>
              </div>
            ))
          ) : (
            <div className="no-results">
              Nenhum profissional encontrado para "{termoPesquisa}"
            </div>
          )}
        </div>
      </div>

      {/* Modal de Perfil Completo */}
      {profissionalSelecionado && (
        <div className="modal-overlay" onClick={() => setProfissionalSelecionado(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setProfissionalSelecionado(null)}>×</button>
            <h2>{profissionalSelecionado.nome}</h2>
            <p><strong>Especialidade:</strong> {profissionalSelecionado.especialidade}</p>
            <p><strong>Avaliação:</strong> {profissionalSelecionado.avaliacao} / 5</p>
            <p><strong>Sobre:</strong> {profissionalSelecionado.bio}</p>
            <button className="agendar-button">Conversar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explorar;
