import React, { useState, useEffect } from 'react';
import lobo from '../../img/lobo.png';
import './MenuLateral.css';
import { jwtDecode } from "jwt-decode";
import { FaHome } from "react-icons/fa";
import { MdPersonSearch } from "react-icons/md";
import { IoDocumentTextSharp, IoNotificationsCircle, IoPerson } from "react-icons/io5";
import { RiChatSmile3Fill } from "react-icons/ri";
import { GiExitDoor } from "react-icons/gi";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate } from 'react-router-dom';

const MenuLateral = () => {

  const [userData, setUserData] = useState({codinome: '', tipo:'Paciente' });
  const [redirect, setRedirect] = useState(null);

  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const toggleMenu = () => {
    setMenuCollapsed(!menuCollapsed);
  };



  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserData({
          codinome: decoded.codinome || decoded.nome || 'Usuário',
          email: decoded.email || '',
          tipo: decoded.tipo_usuario === 'paciente' ? 'Paciente' : 'Profissional'
        });
      } catch (error) {
        console.error("Token inválido:", error);
        localStorage.removeItem('token');
        setRedirect(true);
      }
    }
  }, []);

  async function logout(e) {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setRedirect(true);
        return;
      }

      const resposta = await fetch('http://localhost:3001/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      
      if(resposta.ok){
          localStorage.removeItem('token');
          toast.success('Volte sempre! Saindo...');
      }
      

      setTimeout(() => setRedirect(true), 3000);

    } catch (erro) {
      console.error('Erro no logout:', erro);
      localStorage.removeItem('token');
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to="/login" replace />; // replacte substitui o histórico de navegação evitando voltar para a página anterior
  }

  return (

    <div className="container">
      {/* Menu Lateral */}
      <div className={`sidebar ${menuCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <img src={lobo} width={30} alt='logo do lobo'></img>
            {!menuCollapsed && <span>TherapistFriend</span>}
          </div>
        </div>

        <nav className="sidebar-menu">
          <ul>
            <li><a href={`/dashboard-${userData.tipo}`}><span role="img" aria-label="home"><FaHome /></span> {!menuCollapsed && 'Início'}</a></li>
            {userData.tipo === 'Paciente' && (
              <li><a href="/explorar"><span role="img" aria-label="explore"><MdPersonSearch /></span> {!menuCollapsed && 'Explorar'}</a></li>
            )}

            <li><a href="/relatos"><span role="img" aria-label="relatos"><IoDocumentTextSharp /></span> {!menuCollapsed && 'Relatos'}</a></li>
            <li><a href="/chat"><span role="img" aria-label="Chats"><RiChatSmile3Fill /></span> {!menuCollapsed && 'Chats'}</a></li>
            <li><a href="#"><span role="img" aria-label="notifications"><IoNotificationsCircle /></span> {!menuCollapsed && 'Notificações'}</a></li>
            <li><a href="#"><span role="img" aria-label="messages"><RiChatSmile3Fill /></span> {!menuCollapsed && 'Mensagens'}</a></li>
            <li><a href="#"><span role="img" aria-label="profile"><IoPerson /></span> {!menuCollapsed && 'Perfil'}</a></li>

          </ul>

          <ul>
            <li className='exit'><a href="/" onClick={logout}><span role="img" aria-label="profile"><GiExitDoor /></span> {!menuCollapsed && 'Sair'}</a></li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">JS</div>
            {!menuCollapsed && (
              <div className="user-details">
                <div className="username">{userData.codinome}</div>
                <div className="user-email">{userData.email}</div>
              </div>
            )}
          </div>
          <button className="toggle-button" onClick={toggleMenu}>
            {menuCollapsed ? '>' : '<'}
          </button>
        </div>
      </div>

    </div>
  );
}

export default MenuLateral;
