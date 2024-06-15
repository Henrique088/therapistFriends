import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Cadastro from './Cadastro';
import Ini from './inicio';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Ini />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />

      </Routes>
    </Router>
  );
}

export default App;