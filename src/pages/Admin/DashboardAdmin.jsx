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
import api from '../../api/apiConfig'; 

function DashboardAdmin() {
  const [estatisticas, setEstatisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarEstatisticas = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setEstatisticas(response.data);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        setError('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    carregarEstatisticas();
  }, []);

  if (loading) {
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

  if (error) {
    return (
      <div className="admin-container">
        <MenuLateralAdmin />
        <div className="admin-conteudo">
          <h1>Dashboard</h1>
          <p className="error">{error}</p>
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
          <div className="card">
            <FaUsers/> 
            <span>Usuários: {estatisticas?.usuarios || 0}</span>
          </div>
          <div className="card">
            <FaHandHoldingMedical/> 
            <span>Profissionais: {estatisticas?.profissionais || 0}</span>
          </div>
          <div className="card">
            <GiMedicalDrip/> 
            <span>Pacientes: {estatisticas?.pacientes || 0}</span>
          </div>
          <div className="card">
            <BsCalendarCheck/> 
            <span>Agendamentos: {estatisticas?.agendamentos || 0}</span>
          </div>
          <div className="card">
            <TfiWrite/> 
            <span>Relatos: {estatisticas?.relatos || 0}</span>
          </div>
        </div>

        {/* Gráfico de agendamentos por mês */}
        <div className="grafico">
          <h2>Agendamentos por mês</h2>
          {estatisticas?.agendamentosPorMes?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={estatisticas.agendamentosPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#0fd850" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>Não há dados de agendamentos disponíveis.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;