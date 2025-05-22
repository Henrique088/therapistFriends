import React, { useState } from 'react';
import lobo from '../../img/lobo.png';
import './MenuLateral.css';

const MenuLateral =() => {
    const nome = localStorage.getItem('nome');
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const toggleMenu = () => {
        setMenuCollapsed(!menuCollapsed);
      };
    return (
        
      <div className="container">   
        {/* Menu Lateral */}
      <div className={`sidebar ${menuCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <img src={lobo}width={30} alt='logo do lobo'></img>
          {!menuCollapsed && <span>TherapistFriend</span>}
        </div>
      </div>
      
      <nav className="sidebar-menu">
        <ul>
          <li><a href="#"><span role="img" aria-label="home">🏠</span> {!menuCollapsed && 'Início'}</a></li>
          <li><a href="/explorar"><span role="img" aria-label="explore">🔍</span> {!menuCollapsed && 'Explorar'}</a></li>
          <li><a href="#"><span role="img" aria-label="notifications">🔔</span> {!menuCollapsed && 'Notificações'}</a></li>
          <li><a href="#"><span role="img" aria-label="messages">✉️</span> {!menuCollapsed && 'Mensagens'}</a></li>
          <li><a href="#"><span role="img" aria-label="profile">👤</span> {!menuCollapsed && 'Perfil'}</a></li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">JS</div>
          {!menuCollapsed && (
            <div className="user-details">
              <div className="username">{nome}</div>
              <div className="user-email">joao@exemplo.com</div>
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
