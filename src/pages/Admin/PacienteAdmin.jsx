import React, { useEffect, useState } from 'react';
import MenuLateralAdmin from '../../Components/Menu/MenuLateralAdmin';
import './Admin.css';
import api from '../../api/apiConfig';

function PacientesAdmin() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const carregarPacientes = async () => {
      try {
        const response = await api.get('/admin/pacientes');
        setPacientes(response.data);
      } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
        setError('Erro ao carregar lista de pacientes');
      } finally {
        setLoading(false);
      }
    };

    carregarPacientes();
  }, []);

  // Filtrar pacientes
  const pacientesFiltrados = pacientes.filter(paciente =>
    paciente.usuario?.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
    paciente.usuario?.email?.toLowerCase().includes(filtro.toLowerCase()) ||
    paciente.codinome?.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-container">
        <MenuLateralAdmin />
        <div className="admin-content">
          <h1>Gerenciar Pacientes</h1>
          <p>Carregando pacientes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <MenuLateralAdmin />
        <div className="admin-content">
          <h1>Gerenciar Pacientes</h1>
          <p className="error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <MenuLateralAdmin />
      <div className="admin-content">
        <h1>Gerenciar Pacientes</h1>
        
        {/* Campo de busca */}
        <div className="filtro-container">
          <input
            type="text"
            placeholder="Buscar por nome, email ou codinome..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="filtro-input"
          />
          <span className="contador">
            {pacientesFiltrados.length} de {pacientes.length} pacientes
          </span>
        </div>
        
        {pacientesFiltrados.length === 0 ? (
          <p>
            {filtro ? 'Nenhum paciente encontrado para a busca.' : 'Nenhum paciente cadastrado.'}
          </p>
        ) : (
          <table className="tabela-pacientes">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Codinome</th>
                <th>Telefone</th>
                <th>Data Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {pacientesFiltrados.map(p => (
                <tr key={p.id_usuario}>
                  <td>{p.id_usuario}</td>
                  <td>{p.usuario?.nome}</td>
                  <td>{p.usuario?.email}</td>
                  <td>{p.codinome}</td>
                  <td>{p.telefone}</td>
                  <td>{p.usuario?.data_criacao ? new Date(p.usuario.data_criacao).toLocaleDateString('pt-BR') : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default PacientesAdmin;