import React, { useEffect, useState } from 'react';
import MenuLateralAdmin from '../../Components/Menu/MenuLateralAdmin';
import './ProfissionaisAdmin.css';
import api from '../../api/apiConfig'; 

function ProfissionaisAdmin() {
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // controle do modal
  const [modalOpen, setModalOpen] = useState(false);
  const [historicoOpen, setHistoricoOpen] = useState(false);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState(null);
  const [motivo, setMotivo] = useState('');
  const [status, setStatus] = useState('validado');
  const [historico, setHistorico] = useState([]);

  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('todos');

  useEffect(() => {
    buscarProfissionais();
  }, []);

  const buscarProfissionais = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/profissionais');
      setProfissionais(response.data);
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
      setError('Erro ao carregar lista de profissionais');
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (prof) => {
    setProfissionalSelecionado(prof);
    setMotivo('');
    setStatus('validado');
    setModalOpen(true);
  };

  const abrirHistorico = async (prof) => {
    setProfissionalSelecionado(prof);
    try {
      const response = await api.get(`/admin/profissionais/${prof.id_usuario}/historico`);
      setHistorico(response.data);
      setHistoricoOpen(true);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      alert('Erro ao carregar histórico');
    }
  };

  const enviarDecisao = async () => {
    if (!motivo.trim()) {
      alert('O motivo é obrigatório.');
      return;
    }

    try {
      await api.post('/admin/profissionais/validacao', {
        profissional_id: profissionalSelecionado.id_usuario,
        status,
        motivo
      });

      alert('Decisão registrada com sucesso!');
      setModalOpen(false);
      buscarProfissionais();
    } catch (error) {
      console.error('Erro ao registrar decisão:', error);
      const errorMessage = error.response?.data?.message || 'Falha ao registrar decisão.';
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <MenuLateralAdmin />
        <div className="admin-content">
          <h1>Profissionais</h1>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <MenuLateralAdmin />
        <div className="admin-content">
          <h1>Profissionais</h1>
          <p className="error">{error}</p>
        </div>
      </div>
    );
  }

  const profissionaisFiltrados = profissionais.filter((p) => {
    const termo = busca.toLowerCase();
    const correspondeTexto = 
      p.usuario?.nome?.toLowerCase().includes(termo) || 
      p.usuario?.email?.toLowerCase().includes(termo) || 
      p.telefone?.includes(termo) || 
      p.crp?.toLowerCase().includes(termo);
    
    const correspondeStatus =
      statusFiltro === 'todos' ? true : 
      statusFiltro === 'validados' ? p.validado === true : 
      statusFiltro === 'naoValidados' ? p.validado === false : 
      p.validado === null;
    
    return correspondeTexto && correspondeStatus;
  });

  return (
    <div className="admin-container">
      <MenuLateralAdmin />
      <div className="admin-content">
        <h1>Profissionais</h1>

        <div className="filtro-container">
          <input
            type="text"
            placeholder="Buscar por nome, email, telefone ou CRP..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="validados">Validados</option>
            <option value="naoValidados">Não Validados</option>
            <option value="pendentes">Pendentes</option>
          </select>
        </div>

        <table className="tabela-profissionais">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>CPF</th>
              <th>CRP</th>
              <th>Validado</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {profissionaisFiltrados.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>
                  Nenhum profissional encontrado
                </td>
              </tr>
            ) : (
              profissionaisFiltrados.map((p) => (
                <tr key={p.id_usuario}>
                  <td data-label="Nome">{p.usuario?.nome}</td>
                  <td data-label="Email">{p.usuario?.email}</td>
                  <td data-label="Telefone">{p.telefone}</td>
                  <td data-label="CPF">{p.cpf}</td>
                  <td data-label="CRP">{p.crp}</td>
                  <td data-label="Validado">
                    {p.validado === true ? '✅ Sim' : p.validado === false ? '❌ Não' : '⏳ Em espera'}
                  </td>
                  <td data-label="Ações">
                    <button className='validar_reprovar' onClick={() => abrirModal(p)}>
                      Validar/Reprovar
                    </button>
                    <button className='historico' onClick={() => abrirHistorico(p)}>
                      Histórico
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DE DECISÃO */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Decisão para {profissionalSelecionado?.usuario?.nome}</h2>
            <label>Status:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="validado">Validar</option>
              <option value="reprovado">Reprovar</option>
              <option value="revogado">Revogar</option>
            </select>

            <label>Motivo:</label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Descreva o motivo da decisão..."
              rows={4}
              required
            />

            <div className="modal-actions">
              <button className='btn_salvar' onClick={enviarDecisao}>
                Salvar
              </button>
              <button className='btn_cancelar' onClick={() => setModalOpen(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HISTÓRICO */}
      {historicoOpen && (
        <div className="modal-overlay">
          <div className="modal historico-modal">
            <h2>Histórico de {profissionalSelecionado?.usuario?.nome}</h2>
            {historico.length === 0 ? (
              <p>Sem registros.</p>
            ) : (
              <ul className="historico-lista">
                {historico.map((h) => (
                  <li key={h.id} className="historico-item">
                    <strong>{new Date(h.data_decisao).toLocaleString('pt-BR')}</strong> - 
                    <span className={`status-${h.status}`}> {h.status}</span>
                    <br />
                    <span className="motivo">Motivo: {h.motivo}</span>
                  </li>
                ))}
              </ul>
            )}
            <button className='btn_fechar' onClick={() => setHistoricoOpen(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfissionaisAdmin;