// AgendaPaciente.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar } from 'react-big-calendar';
import moment from 'moment';
import localizer from '../../Utils/calendarLocalizer';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { toast } from 'react-toastify';
import './AgendaPaciente.css';
import ModalAgendamento from '../../Components/Agenda/ModalAgendamento';
import ModalCancelamento from '../../Components/Agenda/ModalCancelamento';
import ModalExplicativo from '../../Components/Agenda/ModalExplicativo';
import { AgendaService } from '../../api/agendaService';
import { MdOutlineQuestionMark } from "react-icons/md";


const AgendaPaciente = () => {
    const { profissionalId, profissionalNome } = useParams();
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataAtual, setDataAtual] = useState(moment().toDate());
    const [mostrarModalAgendamento, setMostrarModalAgendamento] = useState(false);
    const [slotSelecionado, setSlotSelecionado] = useState(null);
    const [mostrarModalCancelamento, setMostrarModalCancelamento] = useState(false);
    const [eventoSelecionado, setEventoSelecionado] = useState(null);
    const [mostrarModalExplicativo, setMostrarModalExplicativo] = useState(false); 


    const carregarAgenda = async (inicio, fim) => {
        if (!profissionalId) return;

        try {
            setLoading(true);
            const response = await AgendaService.getAgenda(profissionalId, inicio.toISOString(), fim.toISOString());

            const eventosFormatados = response.data.map(evento => ({
                ...evento,
                title: evento.title ? evento.title : '',
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

    console.log('Eventos carregados:', eventos);

    useEffect(() => {
        const inicio = moment(dataAtual).startOf('week');
        const fim = moment(dataAtual).endOf('week');
        carregarAgenda(inicio, fim);
    }, [profissionalId, dataAtual]);


    const handleSelectSlot = ({ start, end, action }) => {
        // Ignora arrastos longos, que podem ocorrer acidentalmente em toque.
        // Como step é 60, o slot válido é de 60 minutos.
        const duracaoSelecionada = moment(end).diff(moment(start), 'minutes');
        if (duracaoSelecionada > 60) {
            return;
        }

        // Garante que o slot é exato na hora cheia (ex: 10:00 - 11:00)
        const inicioInteiro = moment(start).startOf('hour');
        const fimInteiro = moment(inicioInteiro).add(1, 'hour');

        // 1. Não permite agendamento no passado
        if (inicioInteiro.isBefore(moment())) {
            toast.error('Não é possível agendar um horário no passado.');
            return;
        }
        
        // 2. Verifica se o slot está ocupado por algum evento (importante para evitar agendamento sobre bloqueios)
        const slotOcupado = eventos.some(evento => {
            const eventoStart = moment(evento.start);
            const eventoEnd = moment(evento.end);
            
            // Verifica se o slot de 1 hora se sobrepõe a qualquer evento existente
            return (
                (inicioInteiro.isSameOrAfter(eventoStart) && inicioInteiro.isBefore(eventoEnd)) || // Slot começa dentro de um evento
                (fimInteiro.isAfter(eventoStart) && fimInteiro.isSameOrBefore(eventoEnd)) ||      // Slot termina dentro de um evento
                (inicioInteiro.isSameOrBefore(eventoStart) && fimInteiro.isSameOrAfter(eventoEnd)) // Evento está dentro do slot
            );
        });

        if (slotOcupado) {
            // Informa ao usuário que o horário não está disponível
            toast.info('Este horário já está ocupado ou indisponível. Clique em um horário vazio.');
            return; 
        }

        setSlotSelecionado({ start: inicioInteiro.toDate(), end: fimInteiro.toDate() });
        setMostrarModalAgendamento(true);
    };


    const onNavigate = (newDate) => {
        // Apenas atualize a data no estado
        setDataAtual(newDate);
    };

    const verificarPodeCancelar = (eventoStart) => {
        const agora = moment();
        const inicioEvento = moment(eventoStart);
        const diferencaHoras = inicioEvento.diff(agora, 'hours');
        return diferencaHoras >= 24;
    };

    const handleCancelamentoConcluido = () => {
        setMostrarModalCancelamento(false);
        setEventoSelecionado(null);
        
        // Recarrega a agenda após o cancelamento
        const inicio = moment(dataAtual).startOf('week');
        const fim = moment(dataAtual).endOf('week');
        carregarAgenda(inicio, fim);
        
        toast.success('Consulta cancelada com sucesso!');
    };

    const onSelectEvent = (evento) => {
        console.log('Evento selecionado:', evento);
        
        if(evento.title === 'BLOQUEADO' || evento.title === 'OCUPADO') {
            toast.info('Este horário está bloqueado e não pode ser alterado.');
            return;
        }

        // Verifica se é um evento que pode ser cancelado (agendamento do paciente)
        if ((evento.title === 'PENDENTE' || evento.title === 'CONFIRMADO') && evento.paciente) {
            const podeCancelar = verificarPodeCancelar(evento.start);
            
            if (!podeCancelar) {
                toast.error('Cancelamento permitido apenas com 24 horas de antecedência.');
                return;
            }
            // alert('Você poderá cancelar este agendamento no próximo passo.');
            setEventoSelecionado(evento);
            setMostrarModalCancelamento(true);
        } else {
            if(evento.title === 'EM USO') {
                return
            }
        }
    };


    const eventStyleGetter = (event) => {
        return {
            style: {

                backgroundColor: event?.title === 'Ocupado' ? '#a0a0a0' : event?.color, // Cor genérica para eventos ocupados
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
            <div className='cabeca'>
            <h1>Agenda do Profissional {profissionalNome}</h1>
            <button 
                        className="icone-info" 
                        title="Explicar a agenda"
                        onClick={() => setMostrarModalExplicativo(true)}
                    >
                        <MdOutlineQuestionMark/>
                    </button>

                    </div>
            <table>
            <thead ></thead>
            <tbody>
              <tr>
                <td><span className="indicativo disponivel"></span> Disponível</td>
                {/* <td><span className="indicativo disponivel"></span> Podem agendar</td> */}
                <td><span className="indicativo confirmado"></span> Confirmado</td>
                {/* <td><span className="indicativo Confirmado"></span> Horário confirmado</td> */}
              </tr>

              <tr>
                <td><span className="indicativo bloqueado"></span> Bloqueado/Cancelado</td>
                {/* <td><span className="indicativo bloqueado"></span> Indisponível</td> */}
                <td><span className="indicativo aguardando"></span> Aguardando</td>
                {/* <td><span className="indicativo aguardando"></span> Pedente de confirmarção</td> */}
              </tr>

            </tbody>
          </table>
            <Calendar
                culture={"pt-BR"}
                localizer={localizer}
                events={eventos}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 800 }}
                // components={{
                //     event: EventComponent // Usa o componente vazio para todos os eventos
                // }}
                messages={{
                    week: 'Semana',
                    day: 'Dia',
                    month: 'Mês',
                    previous: '<',
                    next: '>',
                    today: 'Hoje',
                    noEventsInRange: 'Sem eventos neste intervalo',
                }}
                views={['week', 'day', 'agenda']}
                defaultView="week"
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={onSelectEvent} // Desabilitado para o paciente
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
                        // Recarrega a agenda após o agendamento
                        setMostrarModalAgendamento(false);
                        const inicio = moment(dataAtual).startOf('week');
                        const fim = moment(dataAtual).endOf('week');
                        carregarAgenda(inicio, fim);
                    }}
                />
            )}

            {mostrarModalCancelamento && (
                <ModalCancelamento
                    isOpen={mostrarModalCancelamento}
                    onRequestClose={() => setMostrarModalCancelamento(false)}
                    evento={eventoSelecionado}
                    onCancelamentoConcluido={() => {
                        // Recarrega a agenda após o cancelamento
                        setMostrarModalCancelamento(false);
                        const inicio = moment(dataAtual).startOf('week');
                        const fim = moment(dataAtual).endOf('week');
                        carregarAgenda(inicio, fim);
                    }}
                />
            )}

            <ModalExplicativo
                isOpen={mostrarModalExplicativo}
                onRequestClose={() => setMostrarModalExplicativo(false)}
            />

        </div>
    );
};

export default AgendaPaciente;