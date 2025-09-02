// AgendaPaciente.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar } from 'react-big-calendar';
import moment from 'moment';
import localizer from '../../Utils/calendarLocalizer';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { toast } from 'react-toastify';

import ModalAgendamento from '../../Components/Agenda/ModalAgendamento';
import { AgendaService } from '../../api/agendaService';




const AgendaPaciente = () => {
    const { profissionalId, profissionalNome } = useParams();
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataAtual, setDataAtual] = useState(moment().toDate());
    const [mostrarModalAgendamento, setMostrarModalAgendamento] = useState(false);
    const [slotSelecionado, setSlotSelecionado] = useState(null);
    

    const carregarAgenda = async (inicio, fim) => {
        if (!profissionalId) return;

        try {
            setLoading(true);
            const response = await AgendaService.getAgenda(profissionalId, inicio.toISOString(), fim.toISOString());

            const eventosFormatados = response.data.map(evento => ({
                ...evento,
                start: new Date(evento.start),
                end: new Date(evento.end),
            }));


            setEventos(eventosFormatados);
        } catch (error) {
            toast.error('Erro ao carregar agenda do profissional');
            console.error('Erro detalhado:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const inicio = moment(dataAtual).startOf('week');
        const fim = moment(dataAtual).endOf('week');
        carregarAgenda(inicio, fim);
    }, [profissionalId, dataAtual]);



    const handleSelectSlot = ({ start, end, action }) => {
  // Bloqueia arrastes - apenas permite clicks
  if (action === 'select') {
    return;
  }
  
  // Permite apenas clicks (action === 'click' ou undefined)
  const inicioInteiro = moment(start).startOf('hour');
  const fimInteiro = moment(inicioInteiro).add(1, 'hour');
  
  setSlotSelecionado({ start: inicioInteiro.toDate(), end: fimInteiro.toDate() });
  setMostrarModalAgendamento(true);
};

    const onNavigate = (newDate) => {
        // Apenas atualize a data no estado
        setDataAtual(newDate);
    };


    const eventStyleGetter = (event) => {
        return {
            style: {
                backgroundColor: event?.title == 'Ocupado'?'#a0a0a0': event?.color, // Cor genérica para eventos ocupados
                color: 'white',
                borderRadius: '0px',
                border: 'none',
                cursos: 'pointer'
            }
        };
    };
     const EventComponent = () => {
  return null; // ou <></>; - ele não renderiza nada
};
    return (
        <div style={{ padding: '20px' }}>
            <h1>Agenda do Profissional {profissionalNome}</h1>
            <Calendar
                culture={"pt-BR"}
                localizer={localizer}
                events={eventos}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 800 }}
                components={{
        event: EventComponent // Usa o componente vazio para todos os eventos
      }}
                messages={{
                    week: 'Semana',
                    day: 'Dia',
                    month: 'Mês',
                    previous: '<',
                    next: '>',
                    today: 'Hoje',
                    noEventsInRange: 'Sem eventos neste intervalo',
                }}
                views={['week', 'day']}
                defaultView="week"
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={null} // Desabilitado para o paciente
                eventPropGetter={eventStyleGetter}
                toolbar 
                scrollToTime={new Date()}
                onNavigate={onNavigate}
                min={new Date(2023, 0, 1, 7, 0, 0)} // Início do dia
                max={new Date(2023, 0, 1, 21, 0, 0)} // Fim do dia
                step={60} // Seleção mínima de 60 minutos
  timeslots={1} // Apenas 1 slot por hora
  reziseable={false} // Desabilita redimensionamento de eventos
            />
            {loading && <p>Carregando...</p>}


            {mostrarModalAgendamento && (
                <ModalAgendamento
                    profissionalId={profissionalId}
                    slot={slotSelecionado}
                    onClose={() => setMostrarModalAgendamento(false)}
                    onAgendamentoConcluido={() => {
                        // Recarregue a agenda após o agendamento
                        setMostrarModalAgendamento(false);
                        const inicio = moment(dataAtual).startOf('week');
                        const fim = moment(dataAtual).endOf('week');
                        carregarAgenda(inicio, fim);
                    }}
                />
            )}
        </div>
    );
};

export default AgendaPaciente;