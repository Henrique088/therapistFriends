// src/Components/Menu/MenuLateralAdmin.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MenuLateralAdmin.css';
import { RxBarChart } from "react-icons/rx";
import { FaUsers } from "react-icons/fa";
import { FaHandHoldingMedical } from "react-icons/fa";
import { GiMedicalDrip, GiExitDoor } from "react-icons/gi";
import { BsGearWide } from "react-icons/bs";
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { AiOutlineCaretRight, AiOutlineCaretLeft } from "react-icons/ai";

function MenuLateralAdmin() {
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const location = useLocation();
    const isProfissionalPage = location.pathname === '/profissionais';
    const [redirect, setRedirect] = useState(null);
    const { usuario, setUsuario } = useUser();


    const toggleMenu = () => {
        setMenuCollapsed(!menuCollapsed);
      };
    
      useEffect(() => {
        if (isProfissionalPage ) {
          setMenuCollapsed(true);
        }
      }, [isProfissionalPage]);

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
  return (
    <aside className={`menu-admin ${menuCollapsed ? 'collapsed' : ''}`}>
      <h2 className="menu-titulo">{!menuCollapsed && 'Painel Admin'}</h2>
      <nav>
        <ul>
          <li><Link to="/admin/dashboard"><RxBarChart/> {!menuCollapsed && 'Dashboard'}</Link></li>
          <li><Link to="/admin/usuarios"><FaUsers/> {!menuCollapsed && 'Usuários'}</Link></li>
          <li><Link to="/admin/profissionais"><FaHandHoldingMedical/> {!menuCollapsed && 'Profissionais'}</Link></li>
          <li><Link to="/admin/pacientes"><GiMedicalDrip/> {!menuCollapsed && 'Pacientes'}</Link></li>
          <li><Link to=""  ><BsGearWide/> {!menuCollapsed && 'Configurações'}</Link></li>
            <li><Link to="" onClick={logout} ><GiExitDoor/> {!menuCollapsed && 'Sair'}</Link></li>
        </ul>
      </nav>

      <button className="toggle-button" onClick={toggleMenu}>
                    {menuCollapsed ? <AiOutlineCaretRight /> : <AiOutlineCaretLeft />}
                  </button>
    </aside>
  );
}

export default MenuLateralAdmin;
