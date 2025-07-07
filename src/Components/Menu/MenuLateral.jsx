import React, { useState, useEffect } from 'react';
import lobo from '../../img/lobo.png';
import './MenuLateral.css';
import { FaHome } from "react-icons/fa";
import { MdPersonSearch } from "react-icons/md";
import { IoDocumentTextSharp, IoNotificationsCircle, IoPerson } from "react-icons/io5";
import { RiChatSmile3Fill } from "react-icons/ri";
import { GiExitDoor } from "react-icons/gi";
import { AiOutlineCaretRight, AiOutlineCaretLeft } from "react-icons/ai";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useLocation } from 'react-router-dom';
import { useUsuario } from '../../contexts/UserContext';
import { useSocket } from '../../contexts/SocketContext';
const MenuLateral = () => {
  const { usuario, setUsuario } = useUsuario();
  const [redirect, setRedirect] = useState(null);
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const socket = useSocket();

  const toggleMenu = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  useEffect(() => {
    if (isChatPage) {
      setMenuCollapsed(true);
    }
  }, [isChatPage]);

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
        socket.disconnect();
        setTimeout(() => {
          setRedirect(true);
          
        }, 2000); // Tempo igual ao do toast
      }

    } catch (erro) {
      console.error('Erro no logout:', erro);
      // setUsuario(null);
      setRedirect(true);
    }
  }

  if (redirect) {
    setUsuario(null);
    console.log('Usuário desconectado');
    return <Navigate to="/login" replace />;
  }

  const tipo = usuario?.tipo_usuario === 'paciente' ? 'Paciente' : 'Profissional';

  return (
    <div className="container">
      {/* Menu Lateral */}
      <div className={`sidebar ${menuCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <img src={lobo} width={30} alt='logo do lobo' />
            {!menuCollapsed && <span>TherapistFriend</span>}
          </div>
        </div>

        <nav className={`sidebar-menu ${menuCollapsed ? 'collapsed' : ''}`}>
          <ul>
            <li><a href={`/dashboard-${tipo}`} title='Home'><FaHome /> {!menuCollapsed && 'Início'}</a></li>
            {tipo === 'Paciente' && (
              <li><a href="/explorar" title='Explorar'><MdPersonSearch /> {!menuCollapsed && 'Explorar'}</a></li>
            )}

            <li><a href="/relato" title='Relatos'><IoDocumentTextSharp /> {!menuCollapsed && 'Relatos'}</a></li>
            <li><a href="/chat" title='Chats'><RiChatSmile3Fill /> {!menuCollapsed && 'Chats'}</a></li>
            <li><a href="#" title='Notificações'><IoNotificationsCircle /> {!menuCollapsed && 'Notificações'}</a></li>
            <li><a href="#" title='Perfil'><IoPerson /> {!menuCollapsed && 'Perfil'}</a></li>
          </ul>

          <ul>
            <li className='exit'><a href="/" onClick={logout} title='Sair'><GiExitDoor /> {!menuCollapsed && 'Sair'}</a></li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            {!menuCollapsed && (
              <div className="user-details">
                <div className="avatar">JS</div>
                <div className="username">{usuario?.codinome || usuario?.nome}</div>
                <div className="user-email">{usuario?.email}</div>
              </div>
            )}
          </div>
          {!isChatPage && (
            <button className="toggle-button" onClick={toggleMenu}>
              {menuCollapsed ? <AiOutlineCaretRight /> : <AiOutlineCaretLeft />}
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default MenuLateral;
