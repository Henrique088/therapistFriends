import React, { useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import './ModalCadastroProfissional.css';

Modal.setAppElement('#root');

export default function ModalCadastroProfissional({ isOpen, onClose, token }) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCRP(form.crp)) {
      toast.warn('CRP inválido. Use o formato: CRP-XX/XXXXX');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/profissionais', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Erro ao cadastrar dados');
      }

      toast.success('Dados do profissional cadastrados com sucesso!');
      onClose(); // Fecha o modal
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar os dados.');
    }
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
      <form onSubmit={handleSubmit}>
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
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancelar
          </button>
          <button type="submit" className="submit-btn">
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}
