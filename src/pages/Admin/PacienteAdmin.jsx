import React, { useEffect, useState } from 'react';
import MenuLateralAdmin from '../../Components/Menu/MenuLateralAdmin';
import './Admin.css';

function PacientesAdmin() {
  const [pacientes, setPacientes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/admin/pacientes")
      .then(res => res.json())
      .then(data => setPacientes(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="admin-container">
      <MenuLateralAdmin />
      <div className="admin-content">
        <h1>Gerenciar Pacientes</h1>
        <ul>
          {pacientes.map(p => (
            <li key={p.id_usuario}>
              {p.nome} ({p.codinome})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PacientesAdmin;
