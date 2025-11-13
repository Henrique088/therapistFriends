// Components/Agenda/ModalSolicitacaoUrgencia.jsx

import React, { useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { AgendaService } from '../../api/agendaService';
import { AiFillAlert } from "react-icons/ai";


Modal.setAppElement('#root');

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '450px',
        padding: '30px',
        borderRadius: '10px',
    },
};

const ModalSolicitacaoUrgencia = ({ isOpen, onRequestClose, profissionalId, pacienteId }) => {

    const [motivo, setMotivo] = useState('');
    const [janelaDeTempo, setJanelaDeTempo] = useState('3_dias'); // Default: Próximos 3 dias
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!motivo.trim() || motivo.length < 10) {
            toast.error('Descreva o motivo da urgência com mais detalhes.');
            return;
        }

        if (!profissionalId || !pacienteId) {
            toast.error('Erro de autenticação: Profissional ou Paciente não identificados.');
            return;
        }

        setLoading(true);

        try {
           
            const response = await AgendaService.solicitarUrgencia(
                profissionalId,
                pacienteId,
                motivo,
                janelaDeTempo
            );

            toast.success(response.mensagem || 'Sua solicitação de urgência foi enviada ao profissional!');

            // Limpa o estado e fecha
            setMotivo('');
            setJanelaDeTempo('3_dias');
            onRequestClose();

        } catch (error) {
            console.error('Erro ao solicitar urgência:', error);
            const msg = error.response?.data?.mensagem || 'Falha ao enviar a solicitação. Tente novamente.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
            contentLabel="Solicitar Atendimento de Urgência"
        >
            <h2><AiFillAlert style={{ fontSize: "22px", color: "red" }} /> Solicitar Atendimento de Urgência</h2>

            <p style={{ color: '#dc3545', fontWeight: 'bold' }}>
                Atenção: Esta é uma solicitação de prioridade. O profissional revisará seu pedido e, se aprovado, iniciaremos o processo de realocação de outros pacientes.
            </p>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="motivo" style={{ display: 'block', marginBottom: '5px' }}>
                        Motivo da Urgência:
                    </label>
                    <textarea
                        id="motivo"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        rows="4"
                        placeholder="Descreva detalhadamente por que o atendimento é urgente."
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="janela" style={{ display: 'block', marginBottom: '5px' }}>
                        Janela de Tempo Desejada:
                    </label>
                    <select
                        id="janela"
                        value={janelaDeTempo}
                        onChange={(e) => setJanelaDeTempo(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                    >
                        <option value="3_dias" >Próximos 3 dias</option>
                        <option value="7_dias">Próximos 7 dias</option>
                        {/* <option value="primeiro_disponivel">Primeiro Horário Disponível</option> */}
                    </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                        type="button"
                        onClick={onRequestClose}
                        disabled={loading}
                        style={{ padding: '10px 15px', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        {loading ? 'Enviando...' : 'Confirmar Solicitação'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ModalSolicitacaoUrgencia;