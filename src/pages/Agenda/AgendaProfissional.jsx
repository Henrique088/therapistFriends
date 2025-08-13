import React, { useState, useEffect } from 'react';
import MenuLateral from '../../Components/Menu/MenuLateral';
import { useUser } from '../../contexts/UserContext';
import { Calendar } from 'react-big-calendar';
import localizer from '../../Utils/calendarLocalizer';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { toast } from 'react-toastify';
import ModalDisponibilidade from '../../Components/Agenda/ModalDisponibilidade';
import ModalBloqueio from '../../Components/Agenda/ModalBloqueio';
import { AgendaService } from '../../api/agendaService';
import './AgendaProfissional.css';



const DragAndDropCalendar = withDragAndDrop(Calendar);

function AgendaProfissional() {
  const { usuario } = useUser();
  const [eventos, setEventos] = useState([]);
  const [mostrarModalDisponibilidade, setMostrarModalDisponibilidade] = useState(false);
  const [mostrarModalBloqueio, setMostrarModalBloqueio] = useState(false);
  const [slotSelecionado, setSlotSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);

  // Carregar dados da agenda
  // useEffect(() => {
  //   const carregarAgenda = async () => {
  //     try {
  //       setLoading(true);
  //       const hoje = moment().startOf('day');
  //       const fimSemana = moment().add(7, 'days').endOf('day');

  //       const [disponibilidades, bloqueios] = await Promise.all([
  //         AgendaService.getDisponibilidades(usuario.id, hoje.toISOString(), fimSemana.toISOString()),
  //         AgendaService.getBloqueios(usuario.id, hoje.toISOString(), fimSemana.toISOString())
  //       ]);
  //       console.log('Disponibilidades:', disponibilidades);
  //       console.log('Bloqueios:', bloqueios);
  //       // Verifica se as respostas são arrays válidos (mesmo que vazios)
  //       const disponibilidadesFormatadas = Array.isArray(disponibilidades)
  //         ? disponibilidades.map(d => ({
  //           ...d,
  //           title: d.tipo === 'disponivel' ? 'Disponível' : 'Consulta',
  //           start: new Date(d.data_inicio),
  //           end: new Date(d.data_fim),
  //           color: d.tipo === 'disponivel' ? '#ccffcc' : '#a0d8f6',
  //           bloqueado: false
  //         }))
  //         : [];

  //       const bloqueiosFormatados = Array.isArray(bloqueios)
  //         ? bloqueios.map(b => ({
  //           ...b,
  //           title: 'BLOQUEADO',
  //           start: new Date(b.data_inicio),
  //           end: new Date(b.data_fim),
  //           color: '#ffcccc',
  //           bloqueado: true
  //         }))
  //         : [];

  //       setEventos([...disponibilidadesFormatadas, ...bloqueiosFormatados]);

  //       // Mostra mensagem se não houver eventos
  //       if (disponibilidadesFormatadas.length === 0 && bloqueiosFormatados.length === 0) {
  //         toast.info('Nenhum horário cadastrado para este período');
  //       }
  //     } catch (error) {
  //       // Só mostra erro se não for uma resposta 404 (não encontrado)
  //       if (!error.response || error.response.status !== 404) {
  //         toast.error('Erro ao carregar agenda');
  //         console.error('Erro detalhado:', error);
  //       } else {
  //         // Para 404, considera como agenda vazia
  //         setEventos([]);
  //         toast.info('Nenhum horário cadastrado ainda');
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   carregarAgenda();
  // }, [usuario.id]);


  const carregarAgenda = async (inicio, fim) => {
    if (!usuario?.id) return;

    try {
      setLoading(true);

      const [bloqueios, agendamentos] = await Promise.all([
        AgendaService.getBloqueios(usuario.id, inicio.toISOString(), fim.toISOString()),
        // AgendaService.getAgendamentos(usuario.id, inicio.toISOString(), fim.toISOString())
      ]);

      const bloqueiosFormatados = Array.isArray(bloqueios)
        ? bloqueios.map(b => ({
          ...b,
          title: 'BLOQUEADO',
          start: new Date(b.data_inicio),
          end: new Date(b.data_fim),
          color: '#ffcccc',
          bloqueado: true,
        }))
        : [];

      const agendamentosFormatados = Array.isArray(agendamentos)
        ? agendamentos.map(a => ({
          ...a,
          title: 'AGENDADO',
          start: new Date(a.data_inicio),
          end: new Date(a.data_fim),
          color: '#a0d8f6',
          bloqueado: false,
        }))
        : [];

      const todosEventos = [...bloqueiosFormatados, ...agendamentosFormatados];
      setEventos(todosEventos);

      if (todosEventos.length === 0) {
        toast.info('Nenhum bloqueio ou agendamento para este período');
      }

    } catch (error) {
      toast.error('Erro ao carregar agenda');
      console.error('Erro detalhado:', error);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    // Carrega a agenda para a semana atual por padrão
    const hoje = moment().startOf('week');
    const fimDaSemana = moment().endOf('week');
    carregarAgenda(hoje, fimDaSemana);
  }, [usuario.id]);


  // Manipuladores de seleção no calendário
  const handleSelectSlot = ({ start, end }) => {
    // Garante que o slot de tempo seja de hora em hora
    const inicioInteiro = moment(start).startOf('hour');
    const fimInteiro = moment(end).startOf('hour').add(1, 'hour');

    setSlotSelecionado({ start: inicioInteiro.toDate(), end: fimInteiro.toDate() });
    setMostrarModalBloqueio(true);
  };

  const handleSelectEvent = (event) => {
    if (event.bloqueado) {
      setSlotSelecionado({
        id: event.id,
        start: event.start,
        end: event.end
      });
      setMostrarModalBloqueio(true);
    }
  };

  // Salvar nova disponibilidade
  const handleSalvarDisponibilidade = async (dados) => {
    try {
      setLoading(true);
      const { inicio, fim, tipo } = dados;

      const novoEvento = {
        profissional_id: usuario.id,
        data_inicio: inicio.toISOString(),
        data_fim: fim.toISOString(),
        tipo
      };

      const response = await AgendaService.createDisponibilidade(novoEvento);
      console.log('Nova disponibilidade:', response);
      setEventos(prev => [...prev, {
        ...response,
        title: tipo === 'disponivel' ? 'Disponível' : 'Consulta',
        start: new Date(response.data_inicio),
        end: new Date(response.data_fim),
        color: tipo === 'disponivel' ? '#ccffcc' : '#a0d8f6',
        bloqueado: false
      }]);

      toast.success('Disponibilidade cadastrada com sucesso!');
      setMostrarModalDisponibilidade(false);
    } catch (error) {
      toast.error('Erro ao salvar disponibilidade');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Função para salvar um novo bloqueio (pontual ou recorrente)
  const handleSalvarBloqueio = async (dados) => {
    try {
      setLoading(true);
      const { inicio, fim, recorrente, dias_recorrencia } = dados;

      const novoBloqueio = {
        profissional_id: usuario.id,
        data_inicio: inicio.toISOString(),
        data_fim: fim.toISOString(),
        recorrente,
        dias_recorrencia
      };

      await AgendaService.createBloqueio(novoBloqueio);

      toast.success('Bloqueio salvo com sucesso!');
      setMostrarModalBloqueio(false);

      // Recarrega a agenda após a operação
      const inicioSemana = moment().startOf('week');
      const fimSemana = moment().endOf('week');
      carregarAgenda(inicioSemana, fimSemana);

    } catch (error) {
      toast.error('Erro ao salvar bloqueio');
      console.error('Erro detalhado:', error);
    } finally {
      setLoading(false);
    }
  };


  // Remover bloqueio
  const handleRemoverBloqueio = async () => {
    if (!slotSelecionado?.id) {
      toast.error("ID do bloqueio não encontrado.");
      return;
    }

    try {
      setLoading(true);
      await AgendaService.deleteBloqueio(slotSelecionado.id);

      toast.success('Bloqueio removido com sucesso!');
      setMostrarModalBloqueio(false);

      // Recarrega a agenda após a operação
      const inicioSemana = moment().startOf('week');
      const fimSemana = moment().endOf('week');
      carregarAgenda(inicioSemana, fimSemana);

    } catch (error) {
      toast.error('Erro ao remover bloqueio');
      console.error('Erro detalhado:', error);
    } finally {
      setLoading(false);
    }
  };

  // Funções de navegação do calendário
  const onNavigate = (newDate) => {
    const inicio = moment(newDate).startOf('week');
    const fim = moment(newDate).endOf('week');
    carregarAgenda(inicio, fim);
  };



  // Adicionar novo bloqueio
  const handleAdicionarBloqueio = async () => {
    try {
      setLoading(true);
      const novoBloqueio = {
        profissional_id: usuario.id,
        data_inicio: slotSelecionado.start.toISOString(),
        data_fim: slotSelecionado.end.toISOString(),
        motivo: 'Bloqueio manual'
      };

      const response = await AgendaService.createBloqueio(novoBloqueio);

      setEventos(prev => [...prev, {
        ...response,
        title: 'BLOQUEADO',
        start: new Date(response.data_inicio),
        end: new Date(response.data_fim),
        color: '#ffcccc',
        bloqueado: true
      }]);

      toast.success('Horário bloqueado com sucesso!');
      setMostrarModalDisponibilidade(false);
    } catch (error) {
      toast.error('Erro ao bloquear horário');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Estilização dos eventos
  // Estilização dos eventos do calendário
  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color,
        color: 'black',
        borderRadius: '0px',
        border: 'none',
      }
    };
  };


  return (
    <div className="agenda-container">
      <MenuLateral />

      {/* <ModalDisponibilidade
        visible={mostrarModalDisponibilidade}
        onClose={() => setMostrarModalDisponibilidade(false)}
        onSalvar={handleSalvarDisponibilidade}
        onBloquear={handleAdicionarBloqueio}
        slot={slotSelecionado}
        loading={loading}
      /> */}

      <ModalBloqueio
        visible={mostrarModalBloqueio}
        onClose={() => setMostrarModalBloqueio(false)}
        onSalvarBloqueio={handleSalvarBloqueio}
        onRemover={handleRemoverBloqueio}
        loading={loading}
        slot={slotSelecionado}
      />

      <div className="agenda-content">
        <header className="agenda-header">
          <h1>Agenda de {usuario.nome}</h1>
          <div className="agenda-actions">
            <button
              className="btn-disponibilidade"
              onClick={() => {
                setSlotSelecionado(null);
                setMostrarModalDisponibilidade(true);
              }}
            >
              + Nova Disponibilidade
            </button>
            <button
              className="btn-bloqueio"
              onClick={() => {
                setSlotSelecionado({
                  start: new Date(),
                  end: moment().add(1, 'hour').toDate()
                });
                setMostrarModalDisponibilidade(true);
              }}
            >
              + Bloquear Horário
            </button>
          </div>
        </header>

        <section className="agenda-calendario">
          <DragAndDropCalendar
            culture={"pt-BR"}
            localizer={localizer}
            events={eventos}
            startAccessor="start"
            endAccessor="end"
            showCurrentTimeIndicator={false}
            style={{ height: '80vh', backgroundColor: '#fff', borderRadius: '8px', padding: '1rem' }}
            messages={{
              week: 'Semana',
              day: 'Dia',
              month: 'Mês',
              previous: '<',
              next: '>',
              today: 'Hoje',
              noEventsInRange: 'Sem eventos neste intervalo',
            }}
            views={['month', 'week', 'day']}
            defaultView="week"
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={(event) => {
              setSlotSelecionado(event);
              setMostrarModalBloqueio(true);
            }}
            eventPropGetter={eventStyleGetter}
            resizable
            toolbar
            onNavigate={onNavigate}
          // onEventResize={handleEventResize}
          // onEventDrop={handleEventDrop}
          />
        </section>
      </div>
    </div>
  );
}

export default AgendaProfissional;