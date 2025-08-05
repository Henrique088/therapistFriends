// src/pages/AgendaProfissional.jsx

import React, { useContext } from 'react';
import MenuLateral from '../Components/Menu/MenuLateral';
import { UserContext } from '../contexts/UserContext';
import './AgendaProfissional.css'; // Estilizaremos separadamente

function AgendaProfissional() {
  const { user } = useContext(UserContext);

  return (
    <div className="agenda-container">
      <MenuLateral />
      <div className="agenda-content">
        <header className="agenda-header">
          <h1>Agenda de {user.nome}</h1>
          <button className="btn-disponibilidade">+ Nova Disponibilidade</button>
        </header>

        <section className="agenda-calendario">
          {/* Aqui futuramente vai o calendário com os horários */}
          <div className="calendario-placeholder">
            <p>Calendário semanal aqui</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AgendaProfissional;
