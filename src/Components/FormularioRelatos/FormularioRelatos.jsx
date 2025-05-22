import React, { useState } from 'react';
import './FormularioRelatos.css';

const RelatoForm = ({ onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    categoria: '',
    relato: ''
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
    onSubmit(formData);
  };

  return (
    <div className="relato-modal-overlay">
      <div className="relato-form-container">
        <h1>Escrever Novo Relato</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título</label>
            <input
              type="text"
              name="titulo"
              placeholder="Ex: Pressão no trabalho"
              value={formData.titulo}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Categoria</label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
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
              value={formData.relato}
              onChange={handleChange}
              rows={6}
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              Enviar Relato
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RelatoForm;