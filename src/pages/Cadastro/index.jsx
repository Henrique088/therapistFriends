import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import styles from './Cadastro.module.css';
import lobo from '../../img/lobo.png';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('Paciente'); // valor padrão

  async function handleCadastro(e) {
    e.preventDefault();

    try {
      const resposta = await fetch('http://localhost:3001/auth/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, email, senha, tipo_usuario: tipoUsuario }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert('Cadastro realizado com sucesso!');
        window.location.href = '/login';
      } else {
        alert(dados.msg || 'Erro ao cadastrar.');
      }
    } catch (erro) {
      console.error('Erro ao cadastrar:', erro);
      alert('Erro no servidor.');
    }
  }

  return (
    <div className={styles.cadastroContainer}>
      <div className={styles.formSection}>
        <h1 className={styles.title}>Cadastro</h1>

        <div className={styles.inputGroup}>
          <FiUser className={styles.icon} />
          <input
            type="text"
            id="nome"
            placeholder="Digite seu nome"
            className={styles.input}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <FiMail className={styles.icon} />
          <input
            type="email"
            id="email"
            placeholder="Digite seu E-mail"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <FiLock className={styles.icon} />
          <input
            type="password"
            id="senha"
            placeholder="Digite sua senha"
            className={styles.input}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        {/* Radio para tipo de usuário */}
        <div className={styles.radioGroup}>
          <label>
            <input
              type="radio"
              value="Paciente"
              checked={tipoUsuario === 'Paciente'}
              onChange={() => setTipoUsuario('Paciente')}
            />
            Paciente
          </label>
          <label>
            <input
              type="radio"
              value="profissional"
              checked={tipoUsuario === 'Profissional'}
              onChange={() => setTipoUsuario('Profissional')}
            />
            Profissional
          </label>
        </div>

        <button className={styles.cadastrarButton} onClick={handleCadastro}>Cadastrar</button>

        <button className={styles.cadastrarButtonGoogle}>
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" className={styles.googleIcon} />
          <span>Cadastrar com o Google</span>
        </button>

        <p className={styles.loginText}>
          Já possui uma conta? <Link to="/login" className={styles.link}>Faça login</Link>
        </p>

        <Link to="/" className={styles.backHome}>← Voltar para a Home</Link>
      </div>

      <div className={styles.imageSection}>
        <img
          src={lobo}
          alt="Lobo"
          className={styles.wolfImage}
        />
      </div>
    </div>
  );
}

export default Cadastro;
