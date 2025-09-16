import React, { useEffect, useState } from 'react';
import MenuLateralAdmin from '../../Components/Menu/MenuLateralAdmin';
import './ProfissionaisAdmin.css';

function ProfissionaisAdmin() {
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);

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
    try {
      const res = await fetch('http://localhost:3001/admin/profissionais', 
         { credentials: 'include' },
      );
      const data = await res.json();
      setProfissionais(data);
    } catch (err) {
      console.error('Erro ao buscar profissionais', err);
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
      const res = await fetch(`http://localhost:3001/admin/profissionais/${prof.id_usuario}/historico`,  { credentials: 'include' }
      );
      const hist = await res.json();
      setHistorico(hist);
      setHistoricoOpen(true);
    } catch (err) {
      console.error('Erro ao buscar histórico', err);
    }
  };

  const enviarDecisao = async () => {
    if (!motivo.trim()) {
      alert('O motivo é obrigatório.');
      return;
    }

    try {
      await fetch('http://localhost:3001/admin/profissionais/validacao', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
            
        },
        body: JSON.stringify({
          profissional_id: profissionalSelecionado.id_usuario,
          status,
          motivo
        })
      });

      alert('Decisão registrada com sucesso!');
      setModalOpen(false);
      buscarProfissionais();
    } catch (err) {
      console.error('Erro ao registrar decisão', err);
      alert('Falha ao registrar decisão.');
    }
  };

  if (loading) return <p>Carregando...</p>;


  const profissionaisFiltrados = profissionais.filter((p) => {
    const termo = busca.toLowerCase();
    const correspondeTexto = p.usuario.nome.toLowerCase().includes(termo) || p.usuario.email.toLowerCase().includes(termo) || p.telefone.includes(termo) || p.crp.includes(termo);
    const correspondeStatus =
      statusFiltro === 'todos' ? true : statusFiltro === 'validados' ? p.validado === true : statusFiltro === 'nao_validados' ? p.validado === false : p.validado === null;
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
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  Nenhum profissional encontrado
                </td>
              </tr>
            ) : (
              profissionaisFiltrados.map((p) => (
                <tr key={p.id_usuario}>
                  <td>{p.usuario.nome}</td>
                  <td>{p.usuario.email}</td>
                  <td>{p.telefone}</td>
                  <td>{p.cpf}</td>
                  <td>{p.crp}</td>
                  <td>{p.validado === true ? 'Sim' : p.validado === false ? 'Não' : 'Em espera'}</td>
                  <td>
                    <button className= 'validar_reprovar' onClick={() => abrirModal(p)}>Validar/Reprovar</button>
                    <button className='historico' onClick={() => abrirHistorico(p)}>Histórico</button>
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
            />

            <div className="modal-actions">
              <button className='btn_salvar' onClick={enviarDecisao}>Salvar</button>
              <button className='btn_cancelar' onClick={() => setModalOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HISTÓRICO */}
      {historicoOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Histórico de {profissionalSelecionado?.usuario?.nome}</h2>
            {historico.length === 0 ? (
              <p>Sem registros.</p>
            ) : (
              <ul>
                {historico.map((h) => (
                  <li key={h.id}>
                    <strong>{new Date(h.data_decisao).toLocaleString()}</strong> - {h.status}  
                    <br />
                    Motivo: {h.motivo}
                  </li>
                ))}
              </ul>
            )}
            <button className='btn_fechar'onClick={() => setHistoricoOpen(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfissionaisAdmin;
