import React, { useState, useEffect } from 'react';
import styles from './Explorar.module.css';
import MenuLateral from '../../Components/Menu/MenuLateral';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from 'react-modal'; 
import api from '../../api/apiConfig';

const Explorar = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [profissionalSelecionado, setProfissionalSelecionado] = useState(null);
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isOpen = !!profissionalSelecionado; // Modal aberto se houver profissional selecionado
  const onClose = () => setProfissionalSelecionado(null); // Função para fechar o modal

  Modal.setAppElement('#root'); // Define o elemento raiz para acessibilidade

  // Busca os profissionais da API
  useEffect(() => {
    const fetchProfissionais = async () => {
      try {
        const response = await api.get('/profissionais');
        setProfissionais(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar profissionais');
        toast.error(err.response?.data?.message || 'Erro ao carregar profissionais');
        setLoading(false);
        console.error('Erro na requisição:', err);
        
        
        if (err.response?.status === 401) return;
        
        // Para outros erros, podemos tentar novamente após 5 segundos
        setTimeout(() => {
          fetchProfissionais();
        }, 5000);
      }
    };

    fetchProfissionais();
  }, []);

  const toggleMenu = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  const handlePesquisaChange = (e) => {
    setTermoPesquisa(e.target.value);
  };

  const formatarEspecialidades = (especialidades) => {
    return especialidades
      .replace(/[{}]/g, '')
      .split(',')
      .join(' • ');
  };

  const profissionaisFiltrados = profissionais?.filter((prof) => {
    const searchTerm = termoPesquisa.toLowerCase();
    return (
      prof.usuario.nome.toLowerCase().includes(searchTerm) ||
      formatarEspecialidades(prof.especialidades).toLowerCase().includes(searchTerm)
    );
  });

  // funçao para redirecionar para agenda do profissional selecionado
  const agendarConsulta = (profissionalId) => {
    // Redireciona para a página de agendamento do profissional
    console.log('Redirecionando para agendar consulta com o profissional ID:', profissionalId);
    window.location.href = `/agenda-paciente/${profissionalId}/${profissionalSelecionado.usuario.nome}`;
  }; 

  if (loading) {
    return (
      <div className={styles['app-container']}>
        <MenuLateral collapsed={menuCollapsed} toggleMenu={toggleMenu} />
        <div className={`main-content ${menuCollapsed ? 'collapsed' : ''}`}>
          <div className={styles['loading-container']}>
            <p>Carregando profissionais...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles['app-container']}>
        <MenuLateral collapsed={menuCollapsed} toggleMenu={toggleMenu} />
        <div className={`${styles['main-content']} ${menuCollapsed ? styles.collapsed : ''}`}>
          <div className={styles['error-container']}>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Tentar novamente</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['app-container']}>
      <MenuLateral collapsed={menuCollapsed} toggleMenu={toggleMenu} />

      <div className={`${styles['main-content']} ${menuCollapsed ? styles.collapsed : ''}`}>
        <div className={styles['abas-header']}>
          <h2>Explorar Profissionais</h2>

          <div className={styles['search-container']}>
            <input placeholder="Digite para pesquisar..." class={styles.input} name="text" type="text" value={termoPesquisa} onChange={handlePesquisaChange} />
            
          </div>
        </div>

        <div className={styles['profissionais-list']}>
          {profissionaisFiltrados?.length > 0 ? (
            profissionaisFiltrados.map((prof) => (
              <div key={prof.id_usuario} className={styles['profissional-card']}>
                <div className={styles['profissional-avatar']}>
                  {prof.usuario.nome.charAt(0)}
                </div>
                <div className={styles['profissional-info']}>
                  <h3>{prof.usuario.nome}</h3>
                  <p>{formatarEspecialidades(prof.especialidades)}</p>
                  <p className={styles['profissional-crp']}>CRP: {prof.crp}</p>
                </div>
                <button 
                  onClick={() => setProfissionalSelecionado(prof)} 
                  className={styles['agendar-button']}
                >
                  Ver Perfil Completo
                </button>
              </div>
            ))
          ) : (
            <div className={styles['no-results']}>
              Nenhum profissional encontrado para "{termoPesquisa}"
            </div>
          )}
        </div>
      </div>

      {profissionalSelecionado && (
        <Modal 
        isOpen={isOpen} 
        onRequestClose={onClose} 
        shouldCloseOnOverlayClick={false} 
        className={styles['modal-overlay']} 
        onClick={() => setProfissionalSelecionado(null)}>
          <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles['close-button']} 
              onClick={() => setProfissionalSelecionado(null)}
            >
              ×
            </button>
            <div className={styles['modal-header']}>
              <div className={styles['modal-avatar']}>
                {profissionalSelecionado.usuario.nome.charAt(0)}
              </div>
              <h2>{profissionalSelecionado.usuario.nome}</h2>
            </div>
            
            <div className={styles['modal-details']}>
              <p><strong>CRP:</strong> {profissionalSelecionado.crp}</p>
              <p><strong>Especialidades:</strong> {formatarEspecialidades(profissionalSelecionado.especialidades)}</p>
              <p><strong>Sobre:</strong></p>
              <p className={styles['modal-bio']}>{profissionalSelecionado.bio}</p>
            </div>
            
            <div className={styles['modal-actions']}>
              <button className={styles['agendar-button']}>Conversar</button>
              <button className={`${styles['agendar-button']} ${styles.secondary}`} onClick={()=>agendarConsulta(profissionalSelecionado.id_usuario) }>Agendar Consulta</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Explorar;