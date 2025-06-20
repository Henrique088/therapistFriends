import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SocketProvider } from './contexts/SocketContext';


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
  const [redirect, setRedirect] = useState(null); // null = verificando, true = redirecionar, false = renderizar
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setRedirect(true);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const tipoUsuario = decoded.tipo_usuario;
      const exp = decoded.exp;
      const agora = Date.now() / 1000;

      if (exp < agora) {
        localStorage.removeItem('token');
        toast.warning('Sua sessão expirou. Faça login novamente.');
        setTimeout(() => setRedirect(true), 3000);
        return;
      }

      if (!allowedTypes.includes(tipoUsuario)) {
        toast.error('Acesso não autorizado.');
        setTimeout(() => setRedirect(true), 3000);
        return;
      }

      setRedirect(false); // pode acessar normalmente
    } catch (error) {
      console.error('Token inválido:', error);
      localStorage.removeItem('token');
      toast.error('Token inválido. Faça login novamente.');
      setTimeout(() => setRedirect(true), 3000);
    }
  }, [token, allowedTypes]);

  if (redirect === true) {
    return <Navigate to="/login" />;
  }

  if (redirect === null) {
    return null; // ou um spinner/carregando se quiser
  }

  return children;
}


export default function App() {
  return (
    <Router>
      <ToastContainer 
        position="top-right"
        autoClose={4000}
        // hideProgressBar={false}
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
       
        {/* Telas protegidas por tipo de usuário */}
        <Route path="/dashboard-paciente" element={
          <ProtectedRoute allowedTypes={['paciente']}>
            <DashboardPaciente />
          </ProtectedRoute>
        } />

        <Route path="/dashboard-profissional" element={
          <ProtectedRoute allowedTypes={['profissional']}>
            <DashboardProfissional />
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

        <Route path="/explorar" element ={
          <ProtectedRoute allowedTypes={['paciente', 'profissional']}>
            <Explorar />
          </ProtectedRoute>
        } />

        {/* Redirecionamento padrão */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      
    </Router>
  );
}
