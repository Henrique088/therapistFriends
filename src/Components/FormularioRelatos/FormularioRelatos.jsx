import React, { useState, useEffect } from 'react';
import './FormularioRelatos.css';

const RelatoForm = ({ onCancel, onSubmit, relatoEditando}) => {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [relato, setRelato] = useState('');
  const [anonimo, setAnonimo] = useState(false);
  const [enviando, setEnviando] = useState(false);

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

  useEffect(() => {
    if (relatoEditando) {
      setTitulo(relatoEditando.titulo || '');
      setRelato(relatoEditando.texto || '');
      setCategoria(relatoEditando.categoria || '');
      setAnonimo(relatoEditando.anonimo || false);
    }
  }, [relatoEditando]);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (enviando) return;
    
    setEnviando(true);

    try {
      const url = relatoEditando
        ? `http://localhost:3001/relatos/${relatoEditando.id}`
        : `http://localhost:3001/relatos/criarRelato`;

      const method = relatoEditando ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo,
          categoria,
          texto: relato,
          anonimo: anonimo,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Erro ao enviar relato');
      }

      const data = await response.json();
      
      // Limpa o formulário
      setRelato('');
      setTitulo('');
      setCategoria('');
      setAnonimo(false);
      
      // Chama a função onSubmit passada como prop para atualizar a UI
      if (onSubmit) {
        onSubmit(data, relatoEditando ? 'editado' : 'criado');
      }
      
      onCancel(); // Fecha o modal
      
      console.log('Relato enviado:', data);
      
    } catch (err) {
      console.error('Erro detalhado:', err);
      alert(err.message || 'Erro ao enviar relato');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="relato-modal-overlay">
      <div className="relato-form-container">
        <h1>{relatoEditando ? 'Editar Relato' : 'Escrever Novo Relato'}</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título</label>
            <input
              type="text"
              name="titulo"
              placeholder="Ex: Pressão no trabalho"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              disabled={enviando}
            />
          </div>
          
          <div className="form-group">
            <label>Categoria</label>
            <select
              name="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
              disabled={enviando}
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
              disabled={enviando}
            />
          </div>

          <div className="form-group anonimo-checkbox">
            <label>
              <input
                type="checkbox"
                name="anonimo"
                checked={anonimo}
                onChange={(e) => setAnonimo(e.target.checked)} 
                disabled={enviando}
              />
              Compartilhar de forma anônima
            </label>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onCancel}
              disabled={enviando}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="submit-button" 
              disabled={enviando}
            >
              {enviando ? 'Enviando...' : 'Enviar Relato'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RelatoForm;