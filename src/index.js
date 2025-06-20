// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SocketProvider } from './contexts/SocketContext'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SocketProvider> {/* Provedor do Socket.IO */}
      <App /> 
    </SocketProvider>
  </React.StrictMode>
);