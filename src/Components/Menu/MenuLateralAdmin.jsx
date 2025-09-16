// src/Components/Menu/MenuLateralAdmin.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './MenuLateralAdmin.css';
import { RxBarChart } from "react-icons/rx";
import { FaUsers } from "react-icons/fa";
import { FaHandHoldingMedical } from "react-icons/fa";
import { GiMedicalDrip } from "react-icons/gi";
import { BsGearWide } from "react-icons/bs";

function MenuLateralAdmin() {
  return (
    <aside className="menu-admin">
      <h2 className="menu-titulo">Painel Admin</h2>
      <nav>
        <ul>
          <li><Link to="/admin/dashboard"><RxBarChart/> Dashboard</Link></li>
          <li><Link to="/admin/usuarios"><FaUsers/> Usuários</Link></li>
          <li><Link to="/admin/profissionais"><FaHandHoldingMedical/> Profissionais</Link></li>
          <li><Link to="/admin/pacientes"><GiMedicalDrip/> Pacientes</Link></li>
          <li><Link to="/admin/configuracoes"><BsGearWide/> Configurações</Link></li>
        </ul>
      </nav>
    </aside>
  );
}

export default MenuLateralAdmin;
