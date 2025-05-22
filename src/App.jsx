import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

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
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);
    const tipoUsuario = decoded.tipo_usuario;

    if (allowedTypes.includes(tipoUsuario)) {
      return children;
    } else {
      return <Navigate to="/" />;
    }
  } catch (error) {
    console.error('Token inválido:', error);
    return <Navigate to="/login" />;
  }
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Telas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/explorar" element={<Explorar />} />

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
          <ProtectedRoute allowedTypes={['paciente']}>
            <Relato />
          </ProtectedRoute>
        } />

        <Route path="/relatos-recebidos" element={
          <ProtectedRoute allowedTypes={['profissional']}>
            <RelatosRecebidos />
          </ProtectedRoute>
        } />

        <Route path="/chat/:id" element={
          <ProtectedRoute allowedTypes={['paciente', 'profissional']}>
            <Chat />
          </ProtectedRoute>
        } />

        <Route path="/perfil" element={
          <ProtectedRoute allowedTypes={['paciente', 'profissional']}>
            <Perfil />
          </ProtectedRoute>
        } />

        {/* Redirecionamento padrão */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
