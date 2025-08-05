import React from 'react';

const AgendaGrid = ({ dataAtual }) => {
  return (
    <div style={{ marginTop: '2rem' }}>
      <p>Grid da semana de {dataAtual.toLocaleDateString('pt-BR')}</p>
      {/* Aqui vai o grid de horários */}
    </div>
  );
};

export default AgendaGrid;
