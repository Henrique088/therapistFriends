import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loadingUsuario, setLoadingUsuario] = useState(true);

  const fetchUsuario = useCallback(async () => {
    setLoadingUsuario(true);
    try {
      const response = await fetch('http://localhost:3001/auth/me', {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUsuario(data.info);
        console.log('Usuário autenticado:', data.info);
        localStorage.setItem('userAuthInfo', JSON.stringify(data.info));
      } else {
        console.error('Erro ao buscar usuário:', response.statusText);
        setUsuario(null);
        localStorage.removeItem('userAuthInfo');
        localStorage.removeItem('infoPaciente');
        localStorage.removeItem('infoProfissional');
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      setUsuario(null);
      localStorage.removeItem('userAuthInfo');
      localStorage.removeItem('infoPaciente');
      localStorage.removeItem('infoProfissional');
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

  const logout = useCallback(() => {
    fetch('http://localhost:3001/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then(response => {
        if (response.ok) {
          setUsuario(null);
          localStorage.clear();
        } else {
          console.error('Erro ao fazer logout');
        }
      })
      .catch(error => {
        console.error('Erro ao fazer logout:', error);
      });
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