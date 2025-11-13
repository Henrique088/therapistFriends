// components/Agenda/ModalStatusAgendamento.js

import React from 'react';
import Modal from 'react-modal';
import { AgendaService } from '../../api/agendaService';
import { toast } from 'react-toastify';
import './ModalStatusAgendamento.css';

Modal.setAppElement('#root');

const ModalStatusAgendamento = ({ evento, onClose, onStatusChange }) => {
    const [motivo, setMotivo] = React.useState('');

    if (!evento) return null;

    console.log(evento);

    const handleStatusChange = async (novoStatus) => {
        try {
            await AgendaService.updateAgendamentoStatus(evento.id, novoStatus, motivo);
            toast.success(`Agendamento ${novoStatus} com sucesso!`);
            onStatusChange();
            onClose(); // Fecha o modal após a ação
        } catch (error) {
            toast.error('Erro ao mudar o status do agendamento.');
            console.error(error);
        }
    };

    const formatTime = (date) => {
        if (!date) return '';
        return date.getHours().toString().padStart(2, '0') + ':00';
    };

    return (
        <Modal 
            isOpen={true} 
            onRequestClose={onClose} 
            className="modal-status-agendamento"
            overlayClassName="modal-status-overlay"
        >
            <h2>Detalhes do Agendamento</h2>
            
            <h3>Codinome: {evento?.paciente?.codinome || 'N/A'}</h3>
            <h4>Motivo: {evento?.motivo ? evento.motivo : 'Sem motivo'}</h4>
            <h5>Status: {evento?.status}</h5>
            <h5>Horário: {formatTime(evento?.start)} - {formatTime(evento?.end)}</h5>

            {evento.status === 'pendente' && (
                <>
                    <div className="button-group">
                        <button className="btn-confirmar" onClick={() => handleStatusChange('confirmado')}>
                            Confirmar
                        </button>
                        <button className="btn-rejeitar" onClick={() => handleStatusChange('rejeitado')}>
                            Rejeitar
                        </button>
                    </div>
                </>
            )}

            {evento.status !== 'cancelado' && evento.status !== 'rejeitado' && (
                <>
                    <input 
                        type="text" 
                        placeholder="Motivo do cancelamento (opcional)" 
                        value={motivo} 
                        onChange={(e) => setMotivo(e.target.value)}  
                        className="input-motivo" 
                    />
                    <div className="button-group">
                        <button className="btn-cancelar" onClick={() => handleStatusChange('cancelado')}>
                            Cancelar
                        </button>
                    </div>
                </>
            )}

            <div className="button-group">
                <button className="btn-fechar" onClick={onClose}>
                    Fechar
                </button>
            </div>
        </Modal>
    );
};

export default ModalStatusAgendamento;