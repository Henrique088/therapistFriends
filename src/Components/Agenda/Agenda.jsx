import React, { useEffect, useState } from 'react';
import CalendarHeader from './CalendarHeader';
import AgendaGrid from './AgendaGrid';

const Agenda = () => {
  const [dataAtual, setDataAtual] = useState(new Date());

  const handleMudarSemana = (dias) => {
    const novaData = new Date(dataAtual);
    novaData.setDate(novaData.getDate() + dias);
    setDataAtual(novaData);
  };

  return (
    <div>
      <CalendarHeader dataAtual={dataAtual} onMudarSemana={handleMudarSemana} />
      <AgendaGrid dataAtual={dataAtual} />
    </div>
  );
};

export default Agenda;
