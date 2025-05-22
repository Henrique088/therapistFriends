import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import styles from './Login.module.css';
import lobo from '../../img/lobo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function handleLogin(e) {
  try{
  const resposta = await fetch('http://localhost:3001/auth/login', {
  method: 'POST',
  credentials: 'include', // 👈 garante envio/recebimento de cookies
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, senha }),
});
  const dados = await resposta.json();
      console.log(dados);
      if (resposta.ok && dados.token) {
        localStorage.setItem('token', dados.token);
        // Redireciona com base no tipo do usuário
        if (dados.tipo_usuario === 'paciente') {
          window.location.href = '/dashboard-Paciente';
        } else {
          window.location.href = '/dashboard-Profissional';
        }
      } else {
        alert(dados.msg || 'Erro ao fazer login.');
      }
    } catch (erro) {
      console.error('Erro ao logar:', erro);
      alert('Erro no servidor.');
    }
  
  };
  return (
    <div className={styles.loginContainer}>
      <div className={styles.formSection}>
        <h1 className={styles.title}>Login</h1>

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

        <button className={styles.loginButton} onClick={handleLogin}>Entrar</button>
        <button className={styles.loginButtonGoogle}>
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" className={styles.googleIcon} />
          <span>Entrar com o Google</span>
        </button>

        <p className={styles.cadastroText}>
          Ainda não tem uma conta? <Link to="/cadastro" className={styles.link}>Cadastre-se</Link>
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

export default Login;
