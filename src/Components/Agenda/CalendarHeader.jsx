import React from 'react';

const formatarData = (data) => {
  return data.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
  });
};

const CalendarHeader = ({ dataAtual, onMudarSemana }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <button onClick={() => onMudarSemana(-7)}>← Semana anterior</button>
      <h2>{formatarData(dataAtual)}</h2>
      <button onClick={() => onMudarSemana(7)}>Próxima semana →</button>
    </div>
  );
};

export default CalendarHeader;
