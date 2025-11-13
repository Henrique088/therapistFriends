// src/Components/Agenda/ModalGerenciarUrgencias.jsx 

import React, { useState } from 'react';
import Modal from 'react-modal'; 
import { toast } from 'react-toastify';
import { AgendaService } from '../../api/agendaService'; 
import './ModalGerenciarUrgencias.css'; 
import { PiCheckFatFill } from "react-icons/pi";
import { AiOutlineClose, AiFillAlert } from "react-icons/ai";



const ModalGerenciarUrgencias = ({ visible, onClose, solicitacoes, onDecisao }) => {
    const [loading, setLoading] = useState(false);

    if (!visible) return null;

    const handleDecidir = async (solicitacaoId, acao, motivo = '') => {
        setLoading(true);
        try {
            
            await AgendaService.decidirUrgencia(solicitacaoId, acao, motivo);

            toast.success(`Urgência ${acao === 'aprovar' ? 'aprovada' : 'rejeitada'} com sucesso!`);

            onDecisao(); // Chama a função para recarregar a lista no componente pai

        } catch (error) {
            toast.error(`Erro ao ${acao} a urgência: ` + (error.response?.data?.mensagem || 'Erro desconhecido'));
            console.error('Erro de decisão:', error);
        } finally {
            setLoading(false);
        }
    };

    console.log('Solicitações recebidas no modal:', solicitacoes);

    return (
        <Modal isOpen={visible} onRequestClose={onClose} contentLabel="Gerenciar Urgências" className="modal-urgencia">
            <h2><AiFillAlert/> Solicitações de Urgência Pendentes</h2>
            <button onClick={onClose} className="close-button"><AiOutlineClose/></button>

            {solicitacoes.length === 0 ? (
                <p>Nenhuma solicitação de urgência pendente no momento.</p>
            ) : (
                <div className="lista-urgencias">
                    {solicitacoes.map(solicitacao => (
                        <div key={solicitacao.id} className="card-urgencia">
                            <p>Paciente:{solicitacao.paciente.codinome}</p>
                            <p>Motivo: {solicitacao.motivo}</p>
                            <p>Janela de Tempo: {solicitacao.janela_de_tempo === '7_dias' ? 'Próximos 7 dias' : 'Próximos 3 dias'}</p>

                            <div className="acoes-urgencia">
                                <button
                                    className="btn-aprovar"
                                    onClick={() => handleDecidir(solicitacao.id, 'aprovar')}
                                    disabled={loading}
                                >
                                    {loading ? 'Processando...' : (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <PiCheckFatFill /> Aprovar e Iniciar Realocação
                                        </span>
                                    )}
                                </button>
                                <button
                                    className="btn-rejeitar"
                                    onClick={() => handleDecidir(solicitacao.id, 'rejeitar', 'Não há disponibilidade imediata ou o critério não foi atendido.')}
                                    disabled={loading}
                                >
                                    Rejeitar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </Modal>
    );
};

export default ModalGerenciarUrgencias;