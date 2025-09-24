// src/pages/admin/UsuariosAdmin.jsx
import React, { useEffect, useState } from 'react';
import MenuLateralAdmin from '../../Components/Menu/MenuLateralAdmin';
import './Admin.css';

function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/admin/usuarios', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="admin-container">
      <MenuLateralAdmin />
      <div className="admin-conteudo">
        <h1>Gerenciar Usuários</h1>
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
                <td data-label="Tipo de Usuário">{u.tipo_usuario}</td>
                <td data-label="Ativo">{u.ativo ? 'Ativo' : 'Inativo'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsuariosAdmin;
