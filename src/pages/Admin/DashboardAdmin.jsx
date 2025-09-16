// src/pages/admin/DashboardAdmin.jsx
import React, { useEffect, useState } from 'react';
import MenuLateralAdmin from '../../Components/Menu/MenuLateralAdmin';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Admin.css';
import { FaUsers } from "react-icons/fa";
import { FaHandHoldingMedical } from "react-icons/fa";
import { GiMedicalDrip } from "react-icons/gi";
import { BsCalendarCheck } from "react-icons/bs";
import { TfiWrite } from "react-icons/tfi";

function DashboardAdmin() {
  const [estatisticas, setEstatisticas] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/admin/dashboard', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setEstatisticas(data))
      .catch(err => console.error(err));
  }, []);

  if (!estatisticas) {
    return (
      <div className="admin-container">
        <MenuLateralAdmin />
        <div className="admin-conteudo">
          <h1>Dashboard</h1>
          <p>Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <MenuLateralAdmin />
      <div className="admin-conteudo">
        <h1>Dashboard</h1>

        {/* Cards de resumo */}
        <div className="cards">
          <div className="card"><FaUsers/> Usuários: {estatisticas.usuarios}</div>
          <div className="card"><FaHandHoldingMedical/> Profissionais: {estatisticas.profissionais}</div>
          <div className="card"><GiMedicalDrip/> Pacientes: {estatisticas.pacientes}</div>
          <div className="card"><BsCalendarCheck/> Agendamentos: {estatisticas.agendamentos}</div>
          <div className="card"><TfiWrite/> Relatos: {estatisticas.relatos}</div>
        </div>

        {/* Gráfico de agendamentos por mês */}
        <div className="grafico">
          <h2>Agendamentos por mês</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={estatisticas.agendamentosPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#0fd850" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;
