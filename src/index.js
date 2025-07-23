// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SocketProvider } from './contexts/SocketContext';
import { UserProvider } from './contexts/UserContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <SocketProvider> {/* Provedor do Socket.IO */}
        <App />
      </SocketProvider>
    </UserProvider>
  </React.StrictMode>
);