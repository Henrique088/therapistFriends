import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import './ModalCodinome.css';

Modal.setAppElement('#root');

export default function ModalCodinome({ visible, onClose }) {
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token || '{}');

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
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        codinome: codinome.trim(),
        telefone: telefone.trim()
      }),
    })
      .then(async (resp) => {
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.erro || 'Erro ao salvar');
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
      isOpen={visible}
      onRequestClose={onClose}
      contentLabel="Defina seu Codinome"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Escolha seu codinome</h2>
      <p>Esse será seu nome anônimo visível aos profissionais.</p>

      <input
        type="text"
        value={codinome}
        onChange={(e) => setCodinome(e.target.value)}
        placeholder="Ex: Viajante da Lua"
      />

      <input
        type="text"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
        placeholder="Telefone (ex: (31) 91234-5678)"
      />

      <button onClick={salvarCodinome} disabled={salvando}>
        {salvando ? 'Salvando…' : 'Salvar'}
      </button>
    </Modal>
  );
}
