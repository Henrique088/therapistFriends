import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Cadastro from './Cadastro';
import Ini from './inicio';
import CadProfissioanais from './Cadastro_profissionais';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Ini />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastroP" element={<CadProfissioanais />}></Route>

      </Routes>
    </Router>
  );
}

export default App;