import React, { useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import './ModalCadastroProfissional.css';

Modal.setAppElement('#root');

export default function ModalCadastroProfissional({ isOpen, onClose, token }) {
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState({
    telefone: '',
    cpf: '',
    crp: '',
    bio: '',
    especialidades: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarCRP = (crp) => {
    // Exemplo simples de validação de formato: "CRP-XX/XXXXX"
    const regex = /^CRP-\d{2}\/\d{5}$/;
    return regex.test(crp);
  };
const formatarCPF = (cpf) => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatarTelefone = (telefone) => {
  return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

const SalvarDados = async (event) => {
  event.preventDefault();
  const telefoneFormatado = formatarTelefone(form.telefone);
  const cpfFormatado = formatarCPF(form.cpf);

  setSalvando(true);
  fetch('http://localhost:3001/profissionais', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      telefone: telefoneFormatado,
      cpf: cpfFormatado,
      crp: form.crp.toUpperCase(),
      bio: form.bio.trim(),
      especialidades: form.especialidades.split(',').map(e => e.trim()).filter(e => e).join(', ')
    }),
  })
    .then(async (resp) => {
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.erro || 'Erro ao salvar');
      toast.success('Dados salvos com sucesso!');
      onClose(); // fecha o modal no componente pai
    })
    .catch((err) => {
      toast.error(err.message);
      console.error(err);
    })
    .finally(() => setSalvando(false));
};

  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal"
      overlayClassName="overlay"
      contentLabel="Cadastro de Dados Profissionais"
    >
      <h2>Complete seu cadastro profissional</h2>
      <form onSubmit={SalvarDados}>
        <input
          type="text"
          name="telefone"
          placeholder="Telefone"
          value={form.telefone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          value={form.cpf}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="crp"
          placeholder="CRP (ex: CRP-12/12345)"
          value={form.crp}
          onChange={handleChange}
          required
        />
        <textarea
          name="bio"
          placeholder="Fale um pouco sobre você..."
          value={form.bio}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="especialidades"
          placeholder="Especialidades (separe por vírgulas)"
          value={form.especialidades}
          onChange={handleChange}
          required
        />
        <div className="modal-actions">

          <button type="submit" className="submit-btn" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
