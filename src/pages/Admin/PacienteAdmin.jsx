import React, { useEffect, useState } from 'react';
import MenuLateralAdmin from '../../Components/Menu/MenuLateralAdmin';
import './Admin.css';

function PacientesAdmin() {
  const [pacientes, setPacientes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/admin/pacientes", { credentials: 'include' })
      .then(res => res.json())
      .then(data => setPacientes(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="admin-container">
      <MenuLateralAdmin />
      <div className="admin-content">
        <h1>Gerenciar Pacientes</h1>
        <table className="tabela-pacientes">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Codinome</th>
              <th>Telefone</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map(p => (
              <tr key={p.id_usuario}>
                <td>{p.id_usuario}</td>
                <td>{p.usuario.nome}</td>
                <td>{p.usuario.email}</td>
                <td>{p.codinome}</td>
                <td>{p.telefone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PacientesAdmin;