import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useNotificacoes from './hooks/useNotificacoes';
import { UserProvider, useUser } from '../src/contexts/UserContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ChatProvider } from './contexts/ChatContext';
import './App.css';

// Importe seus componentes de página
import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import DashboardPaciente from './pages/Dashboard/DashboardPaciente';
import DashboardProfissional from './pages/Dashboard/DashboardProfissional';
import Relato from './pages/Relato';

import Chat from './pages/Chat';
import PerfilPaciente from './pages/Perfil/PerfilPaciente';
import PerfilProfissional from './pages/Perfil/PerfilProfissional';
import Explorar from './pages/Explorar';
import Notificacoes from './pages/Notificacoes';
import ModalCodinome from './Components/ModalCodinome/ModalCodinome';
import ModalCadastroProfissional from './Components/modalProfissional/ModalCadastroProfissional';
import Agenda from './pages/Agenda/AgendaProfissional';
import AgendaPaciente from './pages/Agenda/AgendaPaciente';
import DashboardAdmin from './pages/Admin/DashboardAdmin';
import UsuariosAdmin from './pages/Admin/UsuariosAdmin';
import ProfissionaisAdmin from './pages/Admin/ProfissionaisAdmin';
import PacientesAdmin from './pages/Admin/PacienteAdmin';


// Rota protegida com verificação de tipo de usuário
function ProtectedRoute({ children, allowedTypes }) {
  const { usuario, loadingUsuario } = useUser();
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    if (loadingUsuario) {
      setRedirect(null);
      return;
    }

    if (!usuario) {
      toast.warning('Sessão expirada ou não autenticado. Faça login novamente.');
      setTimeout(() => setRedirect(true), 3000);
      return;
    }

    if (!allowedTypes.includes(usuario.tipo_usuario)) {
      toast.error('Acesso não autorizado.');
      setTimeout(() => setRedirect(true), 3000);
      return;
    }

    if (!usuario.dadosCompletos && (usuario.tipo_usuario === 'paciente' || usuario.tipo_usuario === 'profissional')) {
      setTimeout(() => setRedirect(true), 3000);
      return;
    }

    setRedirect(false);
  }, [usuario, loadingUsuario, allowedTypes]);

  if (redirect === true) {
    return <Navigate to="/login" />;
  }

  if (redirect === null || loadingUsuario) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5em' }}><div className="z z-1">Z</div>
      <div className="z z-2">Z</div>
      <div className="z z-3">Z</div>
      <div className="z z-4">Z</div></div>;
  }

  return children;
}

function PublicRoute({ children }) {
  const { usuario, loadingUsuario } = useUser();
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    if (loadingUsuario) {
      setRedirectTo(null);
      return;
    }

    if (usuario) {
      setRedirectTo(
        usuario.tipo_usuario === 'paciente'
          ? '/dashboard-paciente'
          : usuario.tipo_usuario === 'profissional'
            ? '/dashboard-profissional'
            : usuario.tipo_usuario === 'admin'
              ? '/admin/dashboard'
              : '/'
      );
    } else {
      setRedirectTo(false);
    }
  }, [usuario, loadingUsuario]);

  if (redirectTo === null || loadingUsuario) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5em' }}>
      <div className="z z-1">Z</div>
      <div className="z z-2">Z</div>
      <div className="z z-3">Z</div>
      <div className="z z-4">Z</div>
    </div>;
  }

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

export default function App() {
  const { usuario, loadingUsuario, fetchUsuario } = useUser();
  const [showInitialModal, setShowInitialModal] = useState(false);
  const [modalType, setModalType] = useState(null);

  useNotificacoes();

  useEffect(() => {
    if (!loadingUsuario && usuario) {
      console.log("Objeto usuario no App.js:", usuario);

      if (!usuario.dadosCompletos) {
        if (usuario.tipo_usuario === 'paciente') {
          setShowInitialModal(true);
          setModalType('paciente');
        } else if (usuario.tipo_usuario === 'profissional') {

          setShowInitialModal(true);
          setModalType('profissional');
        }
      } else {
        if (usuario.tipo_usuario === 'profissional' && usuario.validado === null) {

          setShowInitialModal(true);
          setModalType('profissional');
        } else if (usuario.tipo_usuario === 'profissional' && usuario.validado === false) {
          toast.error('Seu cadastro profissional foi reprovado. Entre em contato com o suporte para mais informações.');
          setShowInitialModal(true);
          setModalType('profissional');
        } else {
          setShowInitialModal(false);
          setModalType(null);
        }
      }
    } else if (!loadingUsuario && !usuario) {
      setShowInitialModal(false);
      setModalType(null);
    }
  }, [usuario, loadingUsuario]);

  // Lógica de renderização ajustada para não sobrepor o dashboard
  if (loadingUsuario) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', backgroundColor: '#f0f0f0', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
       
<div class="z z-1">Z</div>
<div class="z z-2">Z</div>
<div class="z z-3">Z</div>
<div class="z z-4">Z</div>

        <ToastContainer />
      </div>
    );
  }

  if (showInitialModal) {
    return (
      <>
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
        {modalType === 'paciente' && (
          <ModalCodinome
            isOpen={true}
            onClose={() => {
              setShowInitialModal(false);
              localStorage.setItem('infoPacientePreenchido', 'true');
              toast.success('Informações de paciente salvas!');
              fetchUsuario();
            }}
            shouldCloseOnOverlayClick={false}
            shouldCloseOnEsc={false}
          />
        )}
        {modalType === 'profissional' && (
          <ModalCadastroProfissional
            isOpen={true}
            onClose={() => {
              setShowInitialModal(false);
              localStorage.setItem('infoProfissionalPreenchido', 'true');
              toast.success('Informações de profissional salvas!');
              fetchUsuario();
            }}
          />
        )}
      </>
    );
  }

  return (

    <NotificationProvider>
      <ChatProvider>
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

        <Routes>
          {/* Telas públicas */}
          <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/cadastro" element={<PublicRoute><Cadastro /></PublicRoute>} />

          {/* Telas protegidas */}
          <Route path="/dashboard-profissional" element={<ProtectedRoute allowedTypes={['profissional']}><DashboardProfissional /></ProtectedRoute>} />
          <Route path="/dashboard-paciente" element={<ProtectedRoute allowedTypes={['paciente']}><DashboardPaciente /></ProtectedRoute>} />
          <Route path="/relato" element={<ProtectedRoute allowedTypes={['paciente', 'profissional']}><Relato /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute allowedTypes={['paciente', 'profissional']}><Chat /></ProtectedRoute>} />
          <Route path="/perfil-paciente" element={<ProtectedRoute allowedTypes={['paciente']}><PerfilPaciente /></ProtectedRoute>} />
          <Route path="/perfil-profissional" element={<ProtectedRoute allowedTypes={['profissional']}><PerfilProfissional /></ProtectedRoute>} />
          <Route path="/explorar" element={<ProtectedRoute allowedTypes={['paciente', 'profissional']}><Explorar /></ProtectedRoute>} />
          <Route path="/notificacao" element={<ProtectedRoute allowedTypes={['paciente', 'profissional']}><Notificacoes /></ProtectedRoute>} />
          <Route path="/agenda" element={<ProtectedRoute allowedTypes={['profissional', 'paciente']}><Agenda /></ProtectedRoute>} />
          <Route path="/agenda-paciente/:profissionalId/:profissionalNome" element={<ProtectedRoute allowedTypes={['paciente']}><AgendaPaciente /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedTypes={['admin']}><DashboardAdmin /></ProtectedRoute>} />
          <Route path="/admin/usuarios" element={<ProtectedRoute allowedTypes={['admin']}><UsuariosAdmin /></ProtectedRoute>} />
          <Route path="/admin/profissionais" element={<ProtectedRoute allowedTypes={['admin']}><ProfissionaisAdmin /></ProtectedRoute>} />
          <Route path="/admin/pacientes" element={<ProtectedRoute allowedTypes={['admin']}><PacientesAdmin /></ProtectedRoute>} />

          {/* Rota padrão */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ChatProvider>
    </NotificationProvider>

  );
}