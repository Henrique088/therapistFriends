import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ModalCadastroProfissional.css';
import { useUser } from '../../contexts/UserContext';


Modal.setAppElement('#root');

export default function ModalCadastroProfissional({ isOpen, onClose, token }) {
  const [salvando, setSalvando] = useState(false);
  const [cpfValido, setCpfValido] = useState(true);
  const { usuario, setUsuario } = useUser();
  const [redirect, setRedirect] = useState(null);
  const [form, setForm] = useState({
    telefone: '',
    cpf: '',
    crp: '',
    bio: '',
    especialidades: ''
  });

  useEffect(() => {
    if (usuario?.validado === false) {
      toast.error('Seu cadastro foi rejeitado. Por favor, corrija os dados e envie novamente.');
    }
  }, [usuario]);

  const validateCPF = (cpf) => {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '');

    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Validação dos dígitos verificadores
    let sum = 0;
    let remainder;

    // Primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    // Segundo dígito verificador
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChangeCpf = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setCpfValido(validateCPF(e.target.value));
  };

  const validarCRP = (crp) => {
    // Exemplo simples de validação de formato: "CRP-XX/XXXXX"
    const regex = /^CRP-\d{2}\/\d{5}$/;
    return regex.test(crp);
  };
  const formatCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatarTelefone = (telefone) => {
    return telefone
      .replace(/\D/g, '')
      .replace(/(\d{0})(\d)/, '$1$2')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  };

  const SalvarDados = async (event) => {
    event.preventDefault();
    const telefoneFormatado = formatarTelefone(form.telefone);
    const cpfFormatado = formatCPF(form.cpf);

    setSalvando(true);
    fetch('http://localhost:3001/profissionais', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        telefone: telefoneFormatado || usuario?.telefone,
        cpf: cpfFormatado || usuario?.cpf,
        crp: form.crp.toUpperCase() || usuario?.crp,
        bio: form.bio.trim() || usuario?.bio,
        especialidades: form.especialidades.split(',').map(e => e.trim()).filter(e => e).join(', ') || usuario?.especialidades,
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

  async function logout(e) {
    e.preventDefault();

    try {
      const resposta = await fetch('http://localhost:3001/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (resposta.ok) {
        toast.success('Volte sempre! Saindo...', { autoClose: 2000 });

        setTimeout(() => {
          setRedirect(true);
        }, 2000);
      }
    } catch (erro) {
      console.error('Erro no logout:', erro);
      setRedirect(true);
    }
  }

  if (redirect) {
    setUsuario(null);
    console.log('Usuário desconectado');
    return <Navigate to="/login" replace />;
  }


  return (


    usuario?.dadosCompletos && usuario?.validado === null ? (
      <div className="aguarde-validacao">
        <h2>Cadastro em Análise</h2>
        <p>Seu cadastro está em análise. Por favor, aguarde a validação do administrador.</p>
        <button onClick={logout} className='sair-btn'>Sair</button>
      </div>
    ) : (
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="modal"
        overlayClassName="overlay"
        contentLabel="Cadastro de Dados Profissionais"
      >
        {usuario?.validado === false ? (
          <h2>Corrija seus dados</h2>
        ) : (
          <h2>Complete seu cadastro profissional</h2>
        )}
        <form onSubmit={SalvarDados}>
          <input
            type="text"
            name="telefone"
            placeholder="Telefone"
            value={usuario?.telefone || formatarTelefone(form.telefone)}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="cpf"
            placeholder="CPF"
            value={usuario?.cpf || formatCPF(form.cpf)}
            onChange={handleChangeCpf}
            maxLength={14}
            required
          />
          {!cpfValido && <span className="error">CPF inválido</span>}
          <input
            type="text"
            name="crp"
            placeholder="CRP (ex: 12/12345)"
            value={usuario?.crp || form.crp}
            onChange={handleChange}
            required
          />
          <textarea
            name="bio"
            placeholder="Fale um pouco sobre você..."
            value={usuario?.bio || form.bio}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="especialidades"
            placeholder="Especialidades (separe por vírgulas)"
            value={usuario?.especialidades || form.especialidades}
            onChange={handleChange}
            required
          />
          <div className="modal-actions">
            <button onClick={logout} className='sair-btn'>Sair</button>
            <button type="submit" className="submit-btn" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>
    )
  );
}
