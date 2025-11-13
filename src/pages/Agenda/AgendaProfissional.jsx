import React, { useState, useEffect, useCallback } from 'react';
import MenuLateral from '../../Components/Menu/MenuLateral';
import { useUser } from '../../contexts/UserContext';
import { Calendar } from 'react-big-calendar';
import localizer from '../../Utils/calendarLocalizer';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { toast } from 'react-toastify';
import ModalStatusAgendamento from '../../Components/Agenda/ModalStatusAgendamento';
import ModalBloqueio from '../../Components/Agenda/ModalBloqueio';
import ModalGerenciarUrgencias from '../../Components/Agenda/ModalGerenciarUrgencias';
import { AgendaService } from '../../api/agendaService';
import './AgendaProfissional.css';
import Compartilhar from '../../Components/Compartilhar/Compartilhar';
import { FaExclamationTriangle } from "react-icons/fa";

const DragAndDropCalendar = withDragAndDrop(Calendar);

function AgendaProfissional() {
  const { usuario } = useUser();
  const [eventos, setEventos] = useState([]);
  const [mostrarModalBloqueio, setMostrarModalBloqueio] = useState(false);
  const [slotSelecionado, setSlotSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mostrarModalStatus, setMostrarModalStatus] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  // ESTADOS PARA URGÊNCIA
  const [solicitacoesPendentes, setSolicitacoesPendentes] = useState([]);
  const [mostrarModalUrgencia, setMostrarModalUrgencia] = useState(false);


  const statusColors = {
    'pendente': '#a0d8f6',
    'confirmado': '#57ef2dff',
    'cancelado': '#f5a142ff'
  };

  const carregarAgenda = useCallback(async (inicio, fim) => {
    if (!usuario?.id) return;

    try {
      setLoading(true);

      const [bloqueios, agendamentos] = await Promise.all([
        AgendaService.getBloqueios(usuario.id, inicio.toISOString(), fim.toISOString()),
        AgendaService.getAgendamentos(usuario.id, inicio.toISOString(), fim.toISOString())
      ]);

      const bloqueiosFormatados = Array.isArray(bloqueios)
        ? bloqueios.map(b => ({
          ...b,
          title: 'BLOQUEADO',
          start: new Date(b.data_inicio),
          end: new Date(b.data_fim),
          color: '#a0a0a0',
          bloqueado: true,
        }))
        : [];

      const agendamentosFormatados = Array.isArray(agendamentos)
        ? agendamentos.map(a => ({
          ...a,
          title: a.paciente.codinome,
          start: new Date(a.data_inicio),
          end: new Date(a.data_fim),
          color: statusColors[a.status] || '#e1e129ff',
          bloqueado: false,
        }))
        : [];

      const todosEventos = [...bloqueiosFormatados, ...agendamentosFormatados];
      setEventos(todosEventos);

      // if (todosEventos.length === 0) {

      // }

    } catch (error) {
      toast.error('Erro ao carregar agenda');
      console.error('Erro detalhado:', error);
    } finally {
      setLoading(false);
    }
  }, [usuario.id]);

  // FUNÇÃO PARA URGÊNCIAS PENDENTES
  const carregarUrgenciasPendentes = useCallback(async () => {
    if (!usuario?.id) return;

    try {
      const pendencias = await AgendaService.urgenciaService(usuario.id);
      setSolicitacoesPendentes(pendencias);

      if (pendencias.length > 0) {

        toast.warn(`Você tem ${pendencias.length} solicitações de urgência pendentes!`);
      }

    } catch (error) {
      console.error('Erro ao carregar urgências pendentes:', error);
      if (error.response?.status !== 404) {
        // toast.error('Erro ao buscar urgências pendentes.');
      }
      setSolicitacoesPendentes([]);
    }
  }, [usuario.id]);


  useEffect(() => {
    // Carrega a agenda para a semana atual por padrão
    const hoje = moment().startOf('week');
    const fimDaSemana = moment().endOf('week');
    carregarAgenda(hoje, fimDaSemana);
    carregarUrgenciasPendentes();


    const interval = setInterval(carregarUrgenciasPendentes, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [usuario.id, carregarAgenda, carregarUrgenciasPendentes]);


  // Manipuladores de seleção no calendário
  const handleSelectSlot = ({ start, end }) => {
    // Garante que o slot de tempo seja de hora em hora
    const inicioInteiro = moment(start).startOf('hour');
    const fimInteiro = moment(end).startOf('hour').add(1, 'hour');

    setSlotSelecionado({ start: inicioInteiro.toDate(), end: fimInteiro.toDate() });
    setMostrarModalBloqueio(true);
  };

  const onSelectEvent = (evento) => {
    // Armazena o evento e abre o modal para o profissional
    setEventoSelecionado(evento);
    if (evento.title === 'BLOQUEADO') {
      setSlotSelecionado({
        id: evento.id,
        start: evento.start,
        end: evento.end
      });
      setMostrarModalBloqueio(true);
    }
    else {
      setMostrarModalStatus(true);
    }
  };


  // Função para salvar um novo bloqueio (pontual ou recorrente)
  const handleSalvarBloqueio = async (dados) => {
    try {
      setLoading(true);
      const { inicio, fim, dias_recorrencia } = dados;
      const dataInicioFormatada = moment(inicio).format();
      const dataFimFormatada = moment(fim).format();

      const novoBloqueio = {
        profissional_id: usuario.id,
        data_inicio: dataInicioFormatada,
        data_fim: dataFimFormatada,
        recorrente: dias_recorrencia.length > 0 ? true : false,
        dias_recorrencia,
        id: slotSelecionado?.id
      };

      if (slotSelecionado?.id) {
        // Atualiza o bloqueio existente
        await AgendaService.updateBloqueio(slotSelecionado.id, novoBloqueio);
        toast.success('Bloqueio atualizado com sucesso!');
      } else {
        // Cria um novo bloqueio
        await AgendaService.createBloqueio(novoBloqueio);
        toast.success('Bloqueio criado com sucesso!');
      }

      setMostrarModalBloqueio(false);

      // Recarrega a agenda após a operação
      const inicioSemana = moment().startOf('week');
      const fimSemana = moment().endOf('week');
      carregarAgenda(inicioSemana, fimSemana);

    } catch (error) {
      toast.error('Erro ao salvar bloqueio: ' + (error.response?.data?.erro || 'Erro desconhecido'));
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


  // Funções de Gerenciamento de Urgência
  const handleUrgenciaDecidida = () => {
    // Recarrega a lista de pendências e a agenda após a decisão
    carregarUrgenciasPendentes();
    const hoje = moment().startOf('week');
    const fimDaSemana = moment().endOf('week');
    carregarAgenda(hoje, fimDaSemana);
    setMostrarModalUrgencia(false);
  };



  // Estilização dos eventos
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

      {/* Modal de Bloqueio/Edição */}
      <ModalBloqueio
        visible={mostrarModalBloqueio}
        onClose={() => setMostrarModalBloqueio(false)}
        onSalvarBloqueio={handleSalvarBloqueio}
        onRemover={handleRemoverBloqueio}
        loading={loading}
        slot={slotSelecionado}
      />

      {/* Modal de Status de Agendamento */}
      {mostrarModalStatus && (
        <ModalStatusAgendamento
          evento={eventoSelecionado}
          onClose={() => setMostrarModalStatus(false)}
          onStatusChange={() => {
            // Recarregue a agenda após a mudança de status
            setMostrarModalStatus(false);
            const hoje = moment().startOf('week');
            const fimDaSemana = moment().endOf('week');
            carregarAgenda(hoje, fimDaSemana);
          }}
        />
      )}

      {/* NOVO: Modal de Gerenciamento de Urgências */}
      <ModalGerenciarUrgencias
        visible={mostrarModalUrgencia}
        onClose={() => setMostrarModalUrgencia(false)}
        solicitacoes={solicitacoesPendentes}
        onDecisao={handleUrgenciaDecidida} // Chama a recarga após a decisão
      />


      <div className="agenda-content">
        <header className="agenda-header">
          <h1>Agenda de {usuario.nome}</h1>


          <div className="urgencia-notification">
            <button
              className="btn-gerenciar-urgencia"
              onClick={() => setMostrarModalUrgencia(true)}
              disabled={solicitacoesPendentes.length === 0}
            >
              <FaExclamationTriangle /> Gerenciar Urgências
              {solicitacoesPendentes.length > 0 && (
                <span className="badge-pendente">{solicitacoesPendentes.length}</span>
              )}
            </button>
          </div>


          <table>
            <thead ></thead>
            <tbody>
              <tr>
                <td><span className="indicativo disponivel"></span> Disponível</td>
                <td><span className="indicativo confirmado"></span> Confirmado</td>
              </tr>
              <tr>
                <td><span className="indicativo bloqueado"></span> Bloqueado/Cancelado</td>
                <td><span className="indicativo aguardando"></span> Aguardando</td>
              </tr>
            </tbody>
          </table>
        </header>

        <section className="agenda-calendario">

          <Compartilhar />
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
            views={['month', 'week', 'day', 'agenda']}
            defaultView="week"
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={onSelectEvent}
            eventPropGetter={eventStyleGetter}
            resizable
            toolbar
            onNavigate={onNavigate}
            min={new Date(2025, 0, 1, 7, 0, 0)} // Início do dia
            max={new Date(2025, 0, 1, 21, 0, 0)} // Fim do dia
          />
        </section>
      </div>
    </div>
  );
}

export default AgendaProfissional;