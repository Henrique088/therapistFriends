// src/Components/Agenda/ModalCancelamento.js

import React from 'react';
import Modal from 'react-modal';
import moment from 'moment';
import { toast } from 'react-toastify';
import { AgendaService } from '../../api/agendaService'; // Assumindo que você tem um método de cancelamento aqui
import './ModalCancelamento.css'; // O CSS que criaremos

// Configuração obrigatória para o react-modal
Modal.setAppElement('#root'); // Altere '#root' se o seu ID root for diferente

const ModalCancelamento = ({ isOpen, onRequestClose, evento, onCancelamentoConcluido }) => {
    if (!evento) return null;

    const inicioAgendamento = moment(evento.start);
    const limiteCancelamento = moment(evento.start).subtract(24, 'hours');
    const agora = moment();

    // Verifica se o cancelamento é permitido (mais de 24h de antecedência)
    const podeCancelar = agora.isBefore(limiteCancelamento);

    const handleCancelar = async () => {
        if (!podeCancelar) {
            toast.error('O cancelamento é permitido apenas com mais de 24 horas de antecedência.');
            return;
        }

        try {
            // Assumindo que o seu evento tem um 'id' e que o AgendaService tem um método para cancelar
            await AgendaService.cancelarAgendamento(evento.id);
            toast.success('Agendamento cancelado com sucesso!');
            onCancelamentoConcluido(); // Chama a função para fechar o modal e recarregar a agenda
        } catch (error) {
            toast.error(error.response?.data?.erro);
            console.error('Erro detalhado:', error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Confirmar Cancelamento"
            className="ModalCancelamento"
            overlayClassName="OverlayCancelamento"
        >
            <h2>Cancelar Agendamento</h2>
            <p>Você está prestes a cancelar o seguinte agendamento:</p>
            <p>
                <strong>Início:</strong> {inicioAgendamento.format('DD/MM/YYYY HH:mm')}
            </p>
            <p>
                <strong>Status Atual:</strong> {evento.title}
            </p>

            {podeCancelar ? (
                <>
                    <p className="alerta-sucesso">O cancelamento é permitido.</p>
                    <p>Tem certeza que deseja cancelar?</p>
                    <div className="botoes-modal">
                        <button className="botao-cancelar" onClick={handleCancelar}>
                            Sim, Cancelar
                        </button>
                        <button className="botao-fechar" onClick={onRequestClose}>
                            Não, Manter
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <p className="alerta-erro">Não é possível cancelar. O prazo de 24 horas para cancelamento já expirou.</p>
                    <p>O limite para cancelamento era: {limiteCancelamento.format('DD/MM/YYYY HH:mm')}</p>
                    <div className="botoes-modal">
                        <button className="botao-fechar" onClick={onRequestClose}>
                            Fechar
                        </button>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default ModalCancelamento;