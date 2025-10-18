import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import './ModalCodinome.css';
import { useUser } from '../../contexts/UserContext';
import api from '../../api/apiConfig';

Modal.setAppElement('#root');

export default function ModalCodinome({ isOpen, onClose }) {
  const [codinome, setCodinome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [redirect, setRedirect] = useState(null);
  const { usuario, setUsuario } = useUser();

  const salvarCodinome = async () => {
    if (codinome.trim().length < 3) {
      toast.warn('O codinome deve ter pelo menos 3 caracteres.');
      return;
    }
    if (!telefone.trim()) {
      toast.warn('O telefone é obrigatório.');
      return;
    }

    setSalvando(true);

    try {
      const response = await api.post('/pacientes', {
        codinome: codinome.trim(),
        telefone: telefone.trim()
      });
      
      localStorage.setItem('info', JSON.stringify(response.data.info));
      toast.success('Codinome salvo com sucesso!');
      onClose(); // fecha o modal no componente pai
      
    } catch (error) {
      const errorMessage = error.response?.data?.erro || 'Erro ao salvar';
      toast.error(errorMessage);
      console.error('Erro ao salvar codinome:', error);
    } finally {
      setSalvando(false);
    }
  };

  async function logout(e) {
    e.preventDefault();

    try {
      await api.post('/auth/logout');
      
      toast.success('Volte sempre! Saindo...', { autoClose: 2000 });
      
      setTimeout(() => {
        setRedirect(true);
      }, 2000);
      
    } catch (error) {
      console.error('Erro no logout:', error.response?.data || error.message);
      setRedirect(true);
    }
  }

  if (redirect) {
    setUsuario(null);
    console.log('Usuário desconectado');
    return <Navigate to="/login" replace />;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      className="modal-content"
      overlayClassName="modal-overlay"
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
            placeholder="Digite seu codinome"
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
            placeholder="Digite seu telefone"
          />
        </div>
      </div>
      <div className="modal-footer">
        <button onClick={logout} disabled={salvando}>
          Sair
        </button>
        <button onClick={salvarCodinome} disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </Modal>
  );
}