// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { SocketProvider } from './contexts/SocketContext';
import { UserProvider } from './contexts/UserContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
      <SocketProvider> {/* Provedor do Socket.IO */}
        <App />
      </SocketProvider>
      </BrowserRouter>
    </UserProvider>
  // </React.StrictMode>
);