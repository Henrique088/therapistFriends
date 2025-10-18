// src/pages/admin/UsuariosAdmin.jsx
import React, { useEffect, useState } from 'react';
import MenuLateralAdmin from '../../Components/Menu/MenuLateralAdmin';
import './Admin.css';
import api from '../../api/apiConfig'; 

function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarUsuarios = async () => {
      try {
        const response = await api.get('/admin/usuarios');
        setUsuarios(response.data);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        setError('Erro ao carregar lista de usuários');
      } finally {
        setLoading(false);
      }
    };

    carregarUsuarios();
  }, []);

  if (loading) {
    return (
      <div className="admin-container">
        <MenuLateralAdmin />
        <div className="admin-conteudo">
          <h1>Gerenciar Usuários</h1>
          <p>Carregando usuários...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <MenuLateralAdmin />
        <div className="admin-conteudo">
          <h1>Gerenciar Usuários</h1>
          <p className="error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <MenuLateralAdmin />
      <div className="admin-conteudo">
        <h1>Gerenciar Usuários</h1>
        
        {usuarios.length === 0 ? (
          <p>Nenhum usuário cadastrado.</p>
        ) : (
          <table className="tabela">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id}>
                  <td data-label="ID">{u.id}</td>
                  <td data-label="Nome">{u.nome}</td>
                  <td data-label="Email">{u.email}</td>
                  <td data-label="Tipo de Usuário">
                    <span className={`tipo-${u.tipo_usuario}`}>
                      {u.tipo_usuario}
                    </span>
                  </td>
                  <td data-label="Ativo">
                    <span className={u.ativo ? 'status-ativo' : 'status-inativo'}>
                      {u.ativo ? '✅ Ativo' : '❌ Inativo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default UsuariosAdmin;