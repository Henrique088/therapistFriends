import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/apiConfig';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loadingUsuario, setLoadingUsuario] = useState(true);

  const fetchUsuario = useCallback(async () => {
  setLoadingUsuario(true);
  try {
    const response = await api.get('/auth/me');
    
    setUsuario(response.data.info);
    localStorage.setItem('userAuthInfo', JSON.stringify(response.data.info));
    
  } catch (error) {
    console.error('Erro ao buscar usuário:', error.response?.data || error.message);
    setUsuario(null);
    localStorage.removeItem('userAuthInfo');
    // localStorage.removeItem('infoPaciente');
    // localStorage.removeItem('infoProfissional');
  } finally {
    setLoadingUsuario(false);
  }
}, []);


  useEffect(() => {
    const localAuthInfo = localStorage.getItem('userAuthInfo');
    if (localAuthInfo) {
      try {
        
        setUsuario(JSON.parse(localAuthInfo));

      } catch (error) {
        console.error('Erro ao fazer parse do info:', error);
        localStorage.removeItem('userAuthInfo');
      } finally {
        setLoadingUsuario(false);
      }

    }
    else {
      setLoadingUsuario(false);
    }

    fetchUsuario();
  }, [fetchUsuario]);

  const logout = useCallback(async () => {
  try {
    await api.post('/auth/logout');
    
    // ✅ Se chegou aqui, o logout foi bem-sucedido
    setUsuario(null);
    localStorage.clear();
    
  } catch (error) {
    console.error('Erro ao fazer logout:', error.response?.data || error.message);
  }
}, []);

  return (
    <UserContext.Provider value={{ usuario, setUsuario, loadingUsuario, fetchUsuario, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}