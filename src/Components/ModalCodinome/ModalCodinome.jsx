import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import './ModalCodinome.css';

Modal.setAppElement('#root');

export default function ModalCodinome({ isOpen, onClose }) {


  const [codinome, setCodinome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [salvando, setSalvando] = useState(false);

  const salvarCodinome = () => {
    if (codinome.trim().length < 3) {
      toast.warn('O codinome deve ter pelo menos 3 caracteres.');
      return;
    }
    if (!telefone.trim()) {
      toast.warn('O telefone é obrigatório.');
      return;
    }

    setSalvando(true);

    fetch('http://localhost:3001/pacientes', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      },
      body: JSON.stringify({
        codinome: codinome.trim(),
        telefone: telefone.trim()
      }),
    })
      .then(async (resp) => {
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.erro || 'Erro ao salvar');
        localStorage.setItem('info', JSON.stringify(data.info));
        toast.success('Codinome salvo com sucesso!');
        onClose();          // fecha o modal no componente pai
      })
      .catch((err) => {
        toast.error(err.message);
        console.error(err);
      })
      .finally(() => setSalvando(false));
  };

  return (
    <Modal
      // A prop 'isOpen' do componente `<Modal>` DO REACT-MODAL
      // DEVE ser a mesma 'isOpen' que você recebe nas props do seu ModalCodinome.
      isOpen={isOpen} // <-- ESSA É A CHAVE!
      onRequestClose={onClose} // Permite fechar com ESC ou clique fora, se quiser. Se é obrigatório, defina shouldCloseOnOverlayClick/Esc como false.
      shouldCloseOnOverlayClick={false} // Para garantir que o usuário preencha.
      shouldCloseOnEsc={false}         // Para garantir que o usuário preencha.
      className="modal-content"        // Sua classe CSS para o conteúdo do modal
      overlayClassName="modal-overlay" // Sua classe CSS para o overlay
    >
      <div className="modal-header">
        <h2>Complete Seu Perfil</h2>
      </div>
      <div className="modal-body">
        <p>Por favor, complete as informações do seu perfil para continuar.</p>
        <div className="form-group">
          <label htmlFor="codinome">Codinome:</label>
          <input
            type="text"
            id="codinome"
            value={codinome}
            onChange={(e) => setCodinome(e.target.value)}
            disabled={salvando}
          />
        </div>
        <div className="form-group">
          <label htmlFor="telefone">Telefone:</label>
          <input
            type="text"
            id="telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            disabled={salvando}
          />
        </div>
      </div>
      <div className="modal-footer">
        <button onClick={salvarCodinome} disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </Modal>
  );
}
