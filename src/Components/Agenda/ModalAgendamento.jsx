// components/ModalAgendamento.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import api from '../../api/apiConfig';
import { toast } from 'react-toastify';
import { useUser } from '../../contexts/UserContext';
Modal.setAppElement('#root'); // Configure a raiz da sua aplicação

const ModalAgendamento = ({ profissionalId, slot, onClose, onAgendamentoConcluido }) => {
    const [pacienteNome, setPacienteNome] = useState('');
    const [motivo, setMotivo] = useState('');
    const { usuario } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const agendamentoData = {
                profissional_id: profissionalId,
                paciente_nome: pacienteNome, // Use pacienteNome ou paciente_id
                data_inicio: slot.start.toISOString(),
                data_fim: slot.end.toISOString(),
                motivo: motivo,
            };

            await api.post('/agendamento', agendamentoData);
            toast.success('Agendamento solicitado com sucesso!');
            onAgendamentoConcluido();
        } catch (error) {
            toast.error('Erro ao agendar horário.');
            console.error(error);
        }
    };

    return (
        <Modal isOpen={true} onRequestClose={onClose}>
            <h2>Agendar Horário</h2>
            <p>Horário selecionado: {slot.start.toLocaleString()} - {slot.end.toLocaleString()}</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Seu Nome:</label>
                    <input type="text" value={usuario?.nome || pacienteNome} onChange={(e) => setPacienteNome(e.target.value)} required  readOnly/>
                </div>
                <div>
                    <label>Motivo:</label>
                    <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} required />
                </div>
                <button type="submit">Confirmar Agendamento</button>
                <button type="button" onClick={onClose}>Cancelar</button>
            </form>
        </Modal>
    );
};

export default ModalAgendamento;