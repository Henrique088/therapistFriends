import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const dados = localStorage.getItem('info');
    if (dados) {
      try {
        const usuarioParse = JSON.parse(dados);
        setUsuario(usuarioParse);
      } catch (error) {
        console.error('Erro ao fazer parse do info:', error);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUsuario() {
  return useContext(UserContext);
}