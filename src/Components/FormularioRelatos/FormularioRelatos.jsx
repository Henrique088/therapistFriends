import React, { useState } from 'react';
import './FormularioRelatos.css';
import { jwtDecode } from "jwt-decode";

const RelatoForm = ({ onCancel, onSubmit }) => {
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token)
  const id_usuario = decoded.id;

  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [relato, setRelato] = useState('');
  const [anonimo, setAnonimo] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    categoria: '',
    relato: '',
    anonimo: false,
  });

  const categorias = [
    'Solidão',
    'Ansiedade',
    'Depressão',
    'Timidez',
    'Estresse',
    'Relacionamentos',
    'Transtornos Alimentares',
    'Transtornos de Aprendizagem',
    'Transtornos de Personalidade',
    'Transtornos de Humor',
    'Transtornos de Ansiedade',
    'Transtornos Obsessivo-Compulsivos',
    'Transtornos de Déficit de Atenção e Hiperatividade (TDAH)',
    'Outros'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Relato enviado com sucesso!' + formData.anonimo);
    onSubmit(formData);
  };

  const enviarRelato = () => {
  fetch('http://localhost:3001/relatos/criarRelato', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      titulo,
      categoria,
      texto: relato, // <- corrigido aqui
      anonimo: anonimo || false,
    }),
  })
    .then(async response => {
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Erro ao enviar relato');
      }
      return response.json();
    })
    .then(msg => {
      setRelato('');
      setTitulo('');
      setCategoria('');
      setAnonimo(false);
      onCancel(); 
      console.log('Relato enviado:', msg);
    })
    .catch(err => {
      console.error('Erro detalhado:', err);
    });
};


  return (
    <div className="relato-modal-overlay">
      <div className="relato-form-container">
        <h1>Escrever Novo Relato</h1>
        
        <form onSubmit={enviarRelato}>
          <div className="form-group">
            <label>Título</label>
            <input
              type="text"
              name="titulo"
              placeholder="Ex: Pressão no trabalho"
              value={titulo}
              
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Categoria</label>
            <select
              name="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Relato</label>
            <textarea
              name="relato"
              placeholder="Descreva seu relato com detalhes..."
              value={relato}
              onChange={(e) => setRelato(e.target.value)}
              rows={6}
              required
            />
          </div>

          <div className="form-group anonimo-checkbox">
            <label>Compartilhar de forma anônima</label>
            <input
              type="checkbox"
              name="anonimo"
              checked={anonimo || false}
              onChange={(e) => setAnonimo(e.target.value)}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="submit-button" >
              Enviar Relato
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RelatoForm;