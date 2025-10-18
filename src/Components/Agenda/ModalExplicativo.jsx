// src/Components/Agenda/ModalExplicativo.js

import React from 'react';
import Modal from 'react-modal';
import './ModalExplicativo.css'; // O CSS que criaremos

Modal.setAppElement('#root'); // Altere '#root' se o seu ID root for diferente

const ModalExplicativo = ({ isOpen, onRequestClose }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Explicação da Agenda"
            className="ModalExplicativo"
            overlayClassName="OverlayExplicativo"
        >
            <h2>Como Funciona a Agenda</h2>
            <p>
                Clique em um horário **Disponível** para iniciar o seu agendamento. Se estiver em um celular ou tablet precione o horario desejado e segure por 2 segundos.
            </p>

            <h3>Legenda das Cores:</h3>
            <ul className="legenda-lista">
                <li>
                    <span className="indicativo disponivel-modal"></span> 
                    <strong>Disponível:</strong> Horários abertos para agendamento.
                </li>
                <li>
                    <span className="indicativo aguardando-modal"></span> 
                    <strong>Aguardando:</strong> Seu agendamento foi solicitado e aguarda confirmação do profissional.
                </li>
                <li>
                    <span className="indicativo confirmado-modal"></span> 
                    <strong>Confirmado:</strong> Seu horário está garantido.
                </li>
                <li>
                    <span className="indicativo bloqueado-modal"></span> 
                    <strong>Bloqueado/Cancelado:</strong> Horário indisponível ou cancelado (não pode ser agendado).
                </li>
            </ul>

            <hr />

            <h3>Política de Cancelamento:</h3>
            <p className="regra-cancelamento">
                Para cancelar um agendamento, clique sobre o evento **Confirmado** ou *Pendente* na agenda.
            </p>
            <p className="regra-cancelamento-alerta">
                O cancelamento é permitido apenas com no mínimo **24 horas de antecedência** da hora marcada. Caso o prazo tenha expirado, o cancelamento online não será possível.
            </p>

            <button className="botao-fechar-explicativo" onClick={onRequestClose}>
                Entendi
            </button>
        </Modal>
    );
};

export default ModalExplicativo;