// Components/Menu/MenuLateral.js
import React, { useState, useEffect } from 'react';
import lobo from '../../img/lobo.png';
import styles from './MenuLateral.module.css';
import { FaHome } from "react-icons/fa";
import { MdPersonSearch } from "react-icons/md";
import { IoDocumentTextSharp, IoNotificationsCircle, IoPerson } from "react-icons/io5";
import { RiChatSmile3Fill } from "react-icons/ri";
import { GiExitDoor } from "react-icons/gi";
import { AiOutlineCaretRight, AiOutlineCaretLeft } from "react-icons/ai";
import { ImBook } from "react-icons/im";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useSocket } from '../../contexts/SocketContext';
import { useChat } from '../../contexts/ChatContext';
import { useNotifications } from '../../contexts/NotificationContext'; // Importar o hook

const MenuLateral = () => {
  const { usuario, setUsuario } = useUser();
  const { unreadCount, hasNewNotification } = useNotifications(); // Usar o contexto
  const { unreadChatCount } = useChat();
  const [redirect, setRedirect] = useState(null);
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';
  const isAgendaPage = location.pathname === '/agenda';
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const socket = useSocket();
  
  const toggleMenu = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  useEffect(() => {
    if (isChatPage || isAgendaPage) {
      setMenuCollapsed(true);
    }
  }, [isChatPage, isAgendaPage]);

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
        }, 2000);
      }
    } catch (erro) {
      console.error('Erro no logout:', erro);
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
    <div className={styles.container}>
      {/* Menu Lateral */}
      <div className={`${styles.sidebar} ${menuCollapsed ? styles.collapsed : ''}`}>
        <div className={styles['sidebar-header']}>
          <div className={styles.logo}>
            <img src={lobo} width={30} alt='logo do lobo' />
            {!menuCollapsed && <span>TherapistFriend</span>}
          </div>
        </div>

        <nav className={`${styles['sidebar-menu']} ${menuCollapsed ? styles.collapsed : ''}`}>
          <ul>
            <li><a href={`/dashboard-${tipo}`} title='Home'><FaHome /> {!menuCollapsed && 'Início'}</a></li>
            {tipo === 'Paciente' && (
              <li><a href="/explorar" title='Explorar'><MdPersonSearch /> {!menuCollapsed && 'Explorar'}</a></li>
            )}

            <li><a href="/relato" title='Relatos'><IoDocumentTextSharp /> {!menuCollapsed && 'Relatos'}</a></li>
            <li><a href="/chat" title='Chats'>
              

              {!menuCollapsed && <RiChatSmile3Fill /> }
              {!menuCollapsed && 'Chats'}
              {menuCollapsed && !unreadChatCount && <RiChatSmile3Fill />}
              {unreadChatCount > 0 && (
                <span className={styles['badge-dot']}>{unreadChatCount}</span>
              )}
            </a></li>
            <li><a href="/notificacao" title='Notificações'>
              {!menuCollapsed && <IoNotificationsCircle />}
              {!menuCollapsed && 'Notificações'}
              {menuCollapsed && !hasNewNotification && <IoNotificationsCircle />}
              {hasNewNotification && <span className={styles['badge-dot']}>{unreadCount === 0 ? "!" : unreadCount}</span>}
            </a></li>

            {tipo === 'Profissional' && (
              <>
                <li><a href="/agenda" title='Agenda Profissional'><ImBook /> {!menuCollapsed && 'Agenda'}</a></li>
                <li><a href="/perfil-profissional" title='Perfil Profissional'><IoPerson /> {!menuCollapsed && 'Perfil'}</a></li>
              </>
            )}
            {tipo === 'Paciente' && (
              <li><a href="/perfil-paciente" title='Perfil Paciente'><IoPerson /> {!menuCollapsed && 'Perfil'}</a></li>
            )}
          </ul>

          <ul>
            <li className={styles.exit}><a href="/" onClick={logout} title='Sair'><GiExitDoor /> {!menuCollapsed && 'Sair'}</a></li>
          </ul>
        </nav>

        <div className={styles['sidebar-footer']}>
          <div className={styles['user-info']}>
            {!menuCollapsed && (
              <div className={styles['user-details']}>
                <div className={styles.avatar}>JS</div>
                <div className={styles.username}>{usuario?.codinome || usuario?.nome}</div>
                <div className={styles['user-email']}>{usuario?.email}</div>
              </div>
            )}
          </div>
          {!isChatPage && !isAgendaPage && (
            <button className={styles['toggle-button']} onClick={toggleMenu}>
              {menuCollapsed ? <AiOutlineCaretRight /> : <AiOutlineCaretLeft />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuLateral;