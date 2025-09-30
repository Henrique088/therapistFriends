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
        } catch (error) {
            toast.error('Erro ao mudar o status do agendamento.');
            console.error(error);
        }
    };

    return (
        <Modal isOpen={true} onRequestClose={onClose} className="modal-status-agendamento">
            <h2>Detalhes do Agendamento</h2>
            {/* ... (parágrafos com os detalhes do evento) */}
            <h3> Codinome: {evento?.paciente.codinome}</h3>
            <h4> Motivo: {evento?.motivo ? evento.motivo: 'Sem motivo'}</h4>
            <h5> Status: {evento?.status}</h5>
            <h5>Horas: {evento?.start ? `Início: ${evento.start.getHours().toString().padStart(2, '0')}:00 -`: ''} {evento?.end ? `Término:${evento.end.getHours().toString().padStart(2, '0')}:00`: ''}</h5>
            {evento.status === 'pendente' && (
                <>
                
                {/* <input type="text" placeholder="Motivo em caso de cancelamento(opcional)" value={motivo} onChange={(e) => setMotivo(e.target.value)}  className="input-motivo" /> */}
                <div className="button-group">
                    <button className="btn-confirmar" onClick={() => handleStatusChange('confirmado')}>Confirmar</button>
                    <button className="btn-rejeitar" onClick={() => handleStatusChange('rejeitado')}>Rejeitar</button>
                </div>

                </>
            )}
            {evento.status !== 'cancelado' && (
                <>
                <input type="text" placeholder="Motivo do cancelamento(opcional)" value={motivo} onChange={(e) => setMotivo(e.target.value)}  className="input-motivo" />
                <div className="button-group">
                    <button className="btn-cancelar" onClick={() => handleStatusChange('cancelado')}>Cancelar</button>
                </div>
                </>
            )}
            <div className="button-group">
                <button className="btn-fechar" onClick={onClose}>Fechar</button>
            </div>
        </Modal>
    );
};

export default ModalStatusAgendamento;