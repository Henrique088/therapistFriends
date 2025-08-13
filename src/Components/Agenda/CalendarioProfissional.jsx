import React, { useState, useEffect } from 'react';
import { Calendar, Views } from 'react-big-calendar';
import localizer from '../../Utils/calendarLocalizer'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarioProfissional.css';
import ModalDisponibilidade from './ModalDisponibilidade';

export default function CalendarioProfissional() {
  const [eventos, setEventos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/disponibilidade', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        const eventosFormatados = data.map((item) => ({
          id: item.id,
          title: item.tipo === 'disponivel' ? 'Disponível' : 'Bloqueado',
          start: new Date(`${item.data}T${item.hora_inicio}`),
          end: new Date(`${item.data}T${item.hora_fim}`),
          tipo: item.tipo,
        }));
        setEventos(eventosFormatados);
      })
      .catch(err => console.error('Erro ao buscar eventos:', err));
  }, []);

  const salvarDisponibilidade = async (dados) => {
    try {
      const res = await fetch('http://localhost:3001/disponibilidade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dados)
      });

      const novo = await res.json();

      const eventoNovo = {
        id: novo.id,
        title: novo.tipo === 'disponivel' ? 'Disponível' : 'Bloqueado',
        start: new Date(`${novo.data}T${novo.hora_inicio}`),
        end: new Date(`${novo.data}T${novo.hora_fim}`),
        tipo: novo.tipo,
      };

      setEventos(prev => [...prev, eventoNovo]);
    } catch (err) {
      console.error('Erro ao salvar disponibilidade:', err);
    }
  };

  return (
    <div className="agenda-container">
      <div className="agenda-header">
        <h2>Minha Agenda</h2>
        <button onClick={() => setMostrarModal(true)}>+ Nova Disponibilidade</button>
      </div>

      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '80vh' }}
        defaultView={Views.WEEK}
        views={[Views.WEEK, Views.DAY, Views.AGENDA]}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.tipo === 'bloqueado' ? '#f44336' : '#0fd850',
            color: 'white',
            borderRadius: '6px',
            border: 'none',
            padding: '2px'
          }
        })}
        messages={{
          week: 'Semana',
          day: 'Dia',
          agenda: 'Agenda',
          today: 'Hoje',
          previous: 'Anterior',
          next: 'Próximo',
          noEventsInRange: 'Nenhum evento neste período',
        }}
      />

      {mostrarModal && (
        <ModalDisponibilidade
          onClose={() => setMostrarModal(false)}
          onSalvar={salvarDisponibilidade}
        />
      )}
    </div>
  );
}
