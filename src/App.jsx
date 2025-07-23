import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useNotificacoes from './hooks/useNotificacoes';
import { UserProvider, useUser } from '../src/contexts/UserContext';



import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import DashboardPaciente from './pages/Dashboard/DashboardPaciente';
import DashboardProfissional from './pages/Dashboard/DashboardProfissional';
import Relato from './pages/Relato';
import RelatosRecebidos from './pages/RelatosRecebidos';
import Chat from './pages/Chat';
import Perfil from './pages/Perfil';
import Explorar from './pages/Explorar';
import Notificacoes from './pages/Notificacoes';

import ModalCodinome from './Components/ModalCodinome/ModalCodinome';
import ModalCadastroProfissional from './Components/modalProfissional/ModalCadastroProfissional';

// Rota protegida com verificação de tipo de usuário
function ProtectedRoute({ children, allowedTypes }) {
  const {usuario, loadingUsuario} = useUser();
  const [redirect, setRedirect] = useState(null); // null = carregando, false = autorizado, true = redirecionar
  let exibiuToastExpirado = false;

  useEffect(() => {
    // Se o usuário ainda está carregando no contexto, espere
    if (loadingUsuario) {
      setRedirect(null); // Ainda carregando
      return;
    }

    // Se não há usuário logado, redirecione para o login
    if (!usuario) {
      toast.warning('Sessão expirada ou não autenticado. Faça login novamente.');
      setTimeout(() => setRedirect(true), 3000);
      return;
    }

    // Se o usuário existe, verifique os tipos permitidos
    if (!allowedTypes.includes(usuario.tipo_usuario)) {
      toast.error('Acesso não autorizado.');
      setTimeout(() => setRedirect(true), 3000);
      return;
    }

    setRedirect(false); // Acesso autorizado

  }, [usuario, loadingUsuario, allowedTypes]); // Dependências: usuario, loadingUsuario, allowedTypes

  if (redirect === true) {
    return <Navigate to="/login" />;
  }

  if (redirect === null || loadingUsuario) { 
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5em' }}>Carregando...</div>;
  }

  return children;
}

function PublicRoute({ children }) {
  const { usuario, loadingUsuario } = useUser(); // <--- Use o hook useUser
  const [redirectTo, setRedirectTo] = useState(null); // null = carregando, false = renderizar público, path = redirecionar

  useEffect(() => {
    if (loadingUsuario) {
      setRedirectTo(null); // Ainda carregando
      return;
    }

    if (usuario) { // Se o usuário está logado
      // Redireciona para o dashboard apropriado se já estiver logado
      setRedirectTo(usuario.tipo_usuario === 'paciente' ? '/dashboard-paciente' : '/dashboard-profissional');
    } else {
      setRedirectTo(false); // Não logado, pode renderizar conteúdo público
    }
  }, [usuario, loadingUsuario]);

  if (redirectTo === null || loadingUsuario) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5em' }}>Carregando...</div>; // Ou um spinner
  }

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}


// src/App.js

// ... (imports existentes) ...

export default function App() {
  const { usuario, loadingUsuario, fetchUsuario } = useUser();
  const [showInitialModal, setShowInitialModal] = useState(false);
  const [modalType, setModalType] = useState(null);

  useNotificacoes();

  useEffect(() => {
    // Só tentamos determinar o modal se não estiver carregando e tivermos dados de usuário
    if (!loadingUsuario && usuario) {
      console.log("Objeto usuario no App.js:", usuario);
      // AQUI É A GRANDE MUDANÇA: Usamos a flag 'dados_completos' do backend!
      if (!usuario.dadosCompletos) {
          if (usuario.tipo_usuario === 'paciente') {
              setShowInitialModal(true);
              setModalType('paciente');
          } else if (usuario.tipo_usuario === 'profissional') {
              setShowInitialModal(true);
              setModalType('profissional');
          }
      } else {
        // Se os dados estiverem completos (para qualquer tipo de usuário), não mostra modal
        setShowInitialModal(false);
        setModalType(null);
      }
    } else if (!loadingUsuario && !usuario) {
      // Se não está carregando E não há usuário (deslogado), garanta que nenhum modal esteja visível
      setShowInitialModal(false);
      setModalType(null);
    }
    // Se loadingUsuario é true, esperamos. O componente renderizará o "Carregando dados do usuário..."
  }, [usuario, loadingUsuario]);




  // 1. Mostrar tela de carregamento GLOBAL enquanto o usuário está sendo autenticado/carregado
  if (loadingUsuario) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', backgroundColor: '#f0f0f0', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
        Carregando dados do usuário...
        <ToastContainer /> {/* ToastContainer aqui para que toasts possam aparecer durante o carregamento */}
      </div>
    );
  }

  // 2. Renderizar a aplicação principal (Rotas) E os modais, mas controlar a visibilidade dos modais com `isOpen`
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* RENDERIZE AMBOS OS MODAIS AQUI, CONTROLANDO SUA ABERTURA COM `isOpen` */}
      <ModalCodinome
        isOpen={showInitialModal && modalType === 'paciente'} // Abre apenas se ambas as condições forem verdadeiras
        onClose={() => {
          setShowInitialModal(false);
          localStorage.setItem('infoPacientePreenchido', 'true');
          toast.success('Informações de paciente salvas!');
          fetchUsuario();
        }}
        // Certifique-se de que essas props estão definidas em ModalCodinome.jsx
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
      />

      <ModalCadastroProfissional
        isOpen={showInitialModal && modalType === 'profissional'} // Abre apenas se ambas as condições forem verdadeiras
        onClose={() => {
          setShowInitialModal(false);
          localStorage.setItem('infoProfissionalPreenchido', 'true');
          toast.success('Informações de profissional salvas!');
          fetchUsuario();
        }}
        // Certifique-se de que essas props estão definidas em ModalCadastroProfissional.jsx
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
      />

      <Routes>
        {/* Telas públicas */}
        <Route path="/" element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/cadastro" element={
          <PublicRoute>
            <Cadastro />
          </PublicRoute>
        } />

        {/* Telas protegidas */}
        <Route path="/dashboard-profissional" element={
          <ProtectedRoute allowedTypes={['profissional']}>
            <DashboardProfissional />
          </ProtectedRoute>
        } />
        <Route path="/dashboard-paciente" element={
          <ProtectedRoute allowedTypes={['paciente']}>
            <DashboardPaciente />
          </ProtectedRoute>
        } />
        <Route path="/relato" element={
          <ProtectedRoute allowedTypes={['paciente', 'profissional']}>
            <Relato />
          </ProtectedRoute>
        } />
        <Route path="/relatos-recebidos" element={
          <ProtectedRoute allowedTypes={['profissional']}>
            <RelatosRecebidos />
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute allowedTypes={['paciente', 'profissional']}>
            <Chat />
          </ProtectedRoute>
        } />
        <Route path="/perfil" element={
          <ProtectedRoute allowedTypes={['paciente', 'profissional']}>
            <Perfil />
          </ProtectedRoute>
        } />
        <Route path="/explorar" element={
          <ProtectedRoute allowedTypes={['paciente', 'profissional']}>
            <Explorar />
          </ProtectedRoute>
        } />
        <Route path="/notificacao" element={
          <ProtectedRoute allowedTypes={['paciente', 'profissional']}>
            <Notificacoes />
          </ProtectedRoute>
        } />

        {/* Rota padrão */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

