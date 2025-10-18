import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import styles from './Login.module.css';
import lobo from '../../img/lobo.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api/apiConfig';
import { useUser } from '../../contexts/UserContext';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { setUsuario,fetchUsuario } = useUser();
  const navigate = useNavigate();
  

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !senha) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    try {
  const resposta = await api.post('/auth/login', { email, senha },{ withCredentials: true });

  // Login OK
  const { info } = resposta.data;
  localStorage.setItem('userAuthInfo', JSON.stringify(info));
  await fetchUsuario();

  if (info.tipo_usuario === 'paciente') navigate('/dashboard-paciente');
  else if (info.tipo_usuario === 'profissional') navigate('/dashboard-profissional');
  else if (info.tipo_usuario === 'admin') navigate('/admin/dashboard');
  else navigate('/');
} catch (erro) {
  if (erro.response) {
    // Backend respondeu com erro tratado (401, 400, etc)
    const dados = erro.response.data;

    if (dados.msg === 'Senha incorreta.') setSenha('');
    if (dados.msg === 'Usuário não encontrado.') setEmail('');

    toast.error(dados.msg || 'Falha ao fazer login.');
  } else {
    // Sem resposta (erro de rede, servidor off, etc)
    toast.error('Erro de conexão com o servidor.');
  }
}
  }

  return (
    <div className={styles.loginContainer}>
      <form className={styles.formSection} onSubmit={handleLogin}>
        <h1 className={styles.title}>Login</h1>

        <div className={styles.inputGroup}>
          <FiMail className={styles.icon} />
          <input
            type="email"
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
            placeholder="Digite sua senha"
            className={styles.input}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <button type="submit" className={styles.loginButton}>Entrar</button>

        <button type="button" className={styles.loginButtonGoogle}>
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
            alt="Google"
            className={styles.googleIcon}
          />
          <span>Entrar com o Google</span>
        </button>

        <p className={styles.cadastroText}>
          Ainda não tem uma conta? <Link to="/cadastro" className={styles.link}>Cadastre-se</Link>
        </p>

        <Link to="/" className={styles.backHome}>← Voltar para a Home</Link>
      </form>

      <div className={styles.imageSection}>
        <img src={lobo} alt="Lobo" className={styles.wolfImage} />
      </div>
    </div>
  );
}

export default Login;
