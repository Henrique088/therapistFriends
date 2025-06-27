import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from './contexts/UserContext';


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

// Rota protegida com verificação de tipo de usuário
function ProtectedRoute({ children, allowedTypes }) {
  const [redirect, setRedirect] = useState(null); // null = carregando, false = autorizado, true = redirecionar
  let exibiuToastExpirado = false;

  useEffect(() => {
    const verificarAcesso = async () => {
      try {
        const resposta = await fetch('http://localhost:3001/auth/me', {
          method: 'GET',
          credentials: 'include' // importante para enviar o cookie!
        });

        if (!resposta.ok) {
           if (!exibiuToastExpirado) {
          toast.warning('Sessão expirada. Faça login novamente.');
          exibiuToastExpirado = true;
        }
          setTimeout(() => setRedirect(true), 3000);
          return;
        }

        const data = await resposta.json();
        const tipoUsuario = data.info?.tipo_usuario;
        console.log('Tipo de usuário:', tipoUsuario);
        
        if (!allowedTypes.includes(tipoUsuario)) {
          toast.error('Acesso não autorizado.');
          setTimeout(() => setRedirect(true), 3000);
          return;
        }

        setRedirect(false); // acesso autorizado
      } catch (error) {
        console.error('Erro na verificação de acesso:', error);
        toast.error('Erro na autenticação. Faça login novamente.');
        setRedirect(true);
      }
    };

    verificarAcesso();
  }, [allowedTypes]);

  if (redirect === true) {
    return <Navigate to="/login" />;
  }

  if (redirect === null) {
    return null; 
  }

  return children;
}



export default function App() {
  return (
    <UserProvider>
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

        <Routes>
          {/* Telas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
        
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

          {/* Rota padrão */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

