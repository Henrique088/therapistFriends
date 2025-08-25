// components/ModalAgendamento.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import api from '../../api/apiConfig';
import { toast } from 'react-toastify';
import { useUser } from '../../contexts/UserContext';
import './ModalAgendamento.css';
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
                paciente_nome: pacienteNome, 
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
        <Modal 
    isOpen={true} 
    onRequestClose={onClose} 
    className="modal-agendamento" // Adicione a classe aqui
    overlayClassName="overlay-agendamento" // Opcional, para estilizar o fundo
  >
    <h2>Agendar Horário</h2>
    <p>Horário selecionado: {slot.start.toLocaleString()} - {slot.end.toLocaleString()}</p>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Seu Codinome:</label>
        <input type="text" value={usuario.nome} disabled  className='codinome'/>
      </div>
      <div className="form-group">
        <label>Motivo:</label>
        <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)}  placeholder='Escreve algo se achar necessário...'/>
      </div>
      <div className="button-group"> {/* Adicione um grupo para os botões */}
        <button type="submit" className="btn-confirm">Confirmar Agendamento</button>
        <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
      </div>
    </form>
  </Modal>
);
};

export default ModalAgendamento;