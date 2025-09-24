// src/pages/Dashboard/DashboardProfissional.jsx
import React, { useState, useEffect, useRef } from 'react';
import MenuLateral from '../../Components/Menu/MenuLateral';
import './DashboardProfissional.css';
import { FiBell, FiHeart, FiBookOpen } from 'react-icons/fi';
import { useUser } from '../../contexts/UserContext';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';

export default function DashboardProfissional() {
  const { usuario } = useUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [stats, setStats] = useState({
    consultasHoje: 0,
    consultasSemana: 0,
    pacientesAtivos: 0,
  });
  const [labels, setLabels] = useState('');
  const [valores, setValores] = useState('');
  const [tip, setTip] = useState('');
  const notificationsRef = useRef(null);
  const notificationButtonRef = useRef(null);

  // Dicas e curiosidades de saúde mental
  const mentalHealthTips = [
    'Reserve 10 minutos para respirar profundamente: reduz o estresse e melhora o foco.',
    'Manter uma rotina de sono regular ajuda na prevenção de crises de ansiedade.',
    'Praticar gratidão diariamente fortalece o bem-estar emocional.',
    'A escuta empática é tão importante quanto a fala no processo terapêutico.',
    'Atividade física regular pode reduzir sintomas de depressão em até 30%.',
  ];

  const mentalHealthFacts = [
    'A OMS estima que 1 em cada 4 pessoas será afetada por problemas de saúde mental em algum momento da vida.',
    'A terapia online mostrou eficácia semelhante à presencial em diversos estudos clínicos.',
    'O Brasil é o país com maior taxa de transtornos de ansiedade no mundo, segundo a OMS.',
    'Mindfulness e meditação podem reduzir níveis de cortisol, o hormônio do estresse.',
  ];

  

  useEffect(() => {
    // Fechar painel de notificações ao clicar fora
    const handleClickOutside = (event) => {
      if (
        showNotifications &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target) &&
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  useEffect(() => {
    // Buscar estatísticas do backend
    async function fetchStats() {
      try {
        const res = await fetch(`http://localhost:3001/profissionais/dados/${usuario.id}` , { credentials: 'include' });
        const data = await res.json();
        setStats(data);
        // Preparar dados para o gráfico
        const dias = data.consultasPorDia.map(item => item.dia);
        const totais = data.consultasPorDia.map(item => item.total);
        setLabels(dias);
        setValores(totais);
        
      } catch (err) {
        console.error('Erro ao buscar estatísticas', err);
      }
    }
    fetchStats();

    // Escolher uma dica aleatória
    setTip(mentalHealthTips[Math.floor(Math.random() * mentalHealthTips.length)]);
  }, [usuario.id]);

  

  // Dados para gráfico simples (exemplo: consultas por dia da semana)
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Consultas da Semana',
        data: valores || [2, 3, 1, 4, 2, 0, 1],
        backgroundColor: '#4caf50',
      },
    ],
  };

  return (
    <div className="app">
      <MenuLateral />
      <div className="main-content">
        <div className="content-header">
          <h1>Bem-vindo(a), {usuario.nome}</h1>
          <button
            className="notification-button"
            ref={notificationButtonRef}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FiBell size={24} />
          </button>
        </div>

        {showNotifications && (
          <div className="notifications-panel" ref={notificationsRef}>
            <p>🔔 Você tem novas mensagens e atualizações.</p>
          </div>
        )}

        {/* Cards principais */}
        <div className="info-cards-container">
          <div className="info-card ">
            <h3>Consultas Hoje</h3>
            <p>{stats.consultasHoje}</p>
          </div>
          <div className="info-card">
            <h3>Consultas na Semana</h3>
            <p>{stats.consultasSemana}</p>
          </div>
          <div className="info-card">
            <h3>Pacientes Ativos</h3>
            <p>{stats.pacientesAtivos}</p>
          </div>
        </div>

        {/* Gráfico de consultas na semana */}
        <div className="chart-section">
          <h2>Distribuição das Consultas (Semana)</h2>
          <Chart type="bar" data={chartData} />
        </div>

        {/* Dica do Dia */}
        <div className="tips-section">
          <h2><FiHeart /> Dica de Saúde Mental</h2>
          <p>{tip}</p>
        </div>

        {/* Curiosidades e Recursos */}
        <div className="extra-info">
          <h2><FiBookOpen /> Curiosidades da Área</h2>
          <ul>
            {mentalHealthFacts.map((fact, i) => (
              <li key={i}>{fact}</li>
            ))}
          </ul>
        </div>

        <div className="links-uteis">
          <h2>Links Úteis</h2>
          <ul>
            <li><a href="https://www.who.int/mental_health/pt/" target="_blank" rel="noreferrer">OMS – Saúde Mental</a></li>
            <li><a href="https://www.cfp.org.br/" target="_blank" rel="noreferrer">Conselho Federal de Psicologia</a></li>
            <li><a href="https://www.scielo.org/" target="_blank" rel="noreferrer">Artigos Científicos (SciELO)</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
