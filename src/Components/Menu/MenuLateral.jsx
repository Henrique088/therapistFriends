// Components/Menu/MenuLateral.js
import React, { useState, useEffect } from 'react';
import lobo from '../../img/lobo.png';
import styles from './MenuLateral.module.css';
import { FaHome, FaBars } from "react-icons/fa";
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
import { useNotifications } from '../../contexts/NotificationContext';
import api from '../../api/apiConfig';

const MenuLateral = () => {
  const { usuario, setUsuario } = useUser();
  const { unreadCount, hasNewNotification } = useNotifications();
  const { unreadChatCount } = useChat();
  const [redirect, setRedirect] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';
  const isAgendaPage = location.pathname === '/agenda';
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [menuOpenMobile, setMenuOpenMobile] = useState(false);
  const socket = useSocket();

  const toggleMenu = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  const toggleMenuMobile = () => {
    setMenuOpenMobile(!menuOpenMobile);
  };

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile && (isChatPage || isAgendaPage)) {
      setMenuCollapsed(true);
    }
  }, [isChatPage, isAgendaPage]);

  async function logout(e) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      await api.post('/auth/logout');
      toast.success('Volte sempre! Saindo...', { autoClose: 2000 });
      socket.disconnect();
      setTimeout(() => {
        setRedirect(true);
      }, 2000);
    } catch (error) {
      console.error('Erro no logout:', error.response?.data || error.message);
      setRedirect(true);
    } finally {
      setLoading(false);
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
      
      {/* Overlay do mobile */}
      {menuOpenMobile && <div className={styles['mobile-overlay']} onClick={toggleMenuMobile}></div>}

      {/* Botão hambúrguer (visível apenas em mobile via CSS) */}
      <button className={styles['hamburger-button']} onClick={toggleMenuMobile} title="Abrir Menu">
        <FaBars />
      </button>

      {/* Menu Lateral */}
      <div className={`${styles.sidebar} ${menuCollapsed ? styles.collapsed : ''} ${menuOpenMobile ? styles['open-mobile'] : ''}`}>
        <div className={styles['sidebar-header']}>
          <div className={styles.logo}>
            <img src={lobo} width={30} alt='logo do lobo' />
            {!menuCollapsed && <span>TherapistFriend</span>}
          </div>
        </div>

        <nav className={`${styles['sidebar-menu']} ${menuCollapsed ? styles.collapsed : ''}`}>
          <ul>
            <li><a href={`/dashboard-${tipo}`} title='Home' onClick={toggleMenuMobile}><FaHome /> {!menuCollapsed && 'Início'}</a></li>
            {tipo === 'Paciente' && (
              <li><a href="/explorar" title='Explorar' onClick={toggleMenuMobile}><MdPersonSearch /> {!menuCollapsed && 'Explorar'}</a></li>
            )}

            <li><a href="/relato" title='Relatos' onClick={toggleMenuMobile}><IoDocumentTextSharp /> {!menuCollapsed && 'Relatos'}</a></li>
            <li>
              <a href="/chat" title='Chats' onClick={toggleMenuMobile}>
                {!menuCollapsed && <RiChatSmile3Fill />}
                {!menuCollapsed && 'Chats'}
                {menuCollapsed && !unreadChatCount && <RiChatSmile3Fill />}
                {unreadChatCount > 0 && (
                  <span className={styles['badge-dot']}>{unreadChatCount}</span>
                )}
              </a>
            </li>
            <li>
              <a href="/notificacao" title='Notificações' onClick={toggleMenuMobile}>
                {!menuCollapsed && <IoNotificationsCircle />}
                {!menuCollapsed && 'Notificações'}
                {menuCollapsed && !hasNewNotification && <IoNotificationsCircle />}
                {hasNewNotification && (
                  <span className={styles['badge-dot']}>
                    {unreadCount === 0 ? "!" : unreadCount}
                  </span>
                )}
              </a>
            </li>

            {tipo === 'Profissional' && (
              <>
                <li><a href="/agenda" title='Agenda Profissional' onClick={toggleMenuMobile}><ImBook /> {!menuCollapsed && 'Agenda'}</a></li>
                <li><a href="/perfil-profissional" title='Perfil Profissional' onClick={toggleMenuMobile}><IoPerson /> {!menuCollapsed && 'Perfil'}</a></li>
              </>
            )}
            {tipo === 'Paciente' && (
              <li><a href="/perfil-paciente" title='Perfil Paciente' onClick={toggleMenuMobile}><IoPerson /> {!menuCollapsed && 'Perfil'}</a></li>
            )}
          </ul>

          <ul>
            <li className={styles.exit}>
              <a href="/" onClick={(e) => { logout(e); toggleMenuMobile(); }} title='Sair' disabled={loading}>
                <GiExitDoor /> {!menuCollapsed && (loading ? 'Saindo...' : 'Sair')}
              </a>
            </li>
          </ul>
        </nav>

        <div className={styles['sidebar-footer']}>
          <div className={styles['user-info']}>
            {!menuCollapsed && (
              <div className={styles['user-details']}>
                <div className={styles.avatar}>{usuario?.nome?.substring(0, 2)}</div>
                <div className={styles.username}>{usuario?.codinome || usuario?.nome}</div>
                <div className={styles['user-email']}>{usuario?.email}</div>
              </div>
            )}
          </div>
          {!isChatPage && !isAgendaPage && (
            <button className={`${styles['toggle-button']} ${styles['desktop-only']}`} onClick={toggleMenu}>
              {menuCollapsed ? <AiOutlineCaretRight /> : <AiOutlineCaretLeft />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuLateral;
