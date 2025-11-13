import React, { useState, useEffect } from 'react';
import './FormularioRelatos.css';
import { toast } from 'react-toastify';
import EmojiPicker from '../../Utils/emojiPicker';
import api from '../../api/apiConfig';

const RelatoForm = ({ onCancel, onSubmit, relatoEditando }) => {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [relato, setRelato] = useState('');
  const [anonimo, setAnonimo] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [emojiPosition, setEmojiPosition] = useState('top-center'); 

  const categorias = [
    'Solidão', 'Ansiedade', 'Depressão', 'Timidez', 'Autoestima',
    'Saúde Mental', 'Estresse', 'Relacionamentos', 'Transtornos Alimentares',
    'Transtornos de Aprendizagem', 'Transtornos de Personalidade',
    'Transtornos de Humor', 'Transtornos de Ansiedade',
    'Transtornos Obsessivo-Compulsivos',
    'Transtornos de Déficit de Atenção e Hiperatividade (TDAH)', 'Outros'
  ];

  useEffect(() => {
    if (relatoEditando) {
      setTitulo(relatoEditando.titulo || '');
      setRelato(relatoEditando.texto || '');
      setCategoria(relatoEditando.categoria || '');
      setAnonimo(relatoEditando.anonimo || false);
    }
  }, [relatoEditando]);

  //Detecta tipo de tela e orientação
  useEffect(() => {
    const updateEmojiPosition = () => {
      const isMobile = window.innerWidth <= 768;
      const isLandscape = window.innerWidth > window.innerHeight;

      if (isMobile && isLandscape) {
        setEmojiPosition('right-center'); // em celular deitado
      } else if (isMobile && !isLandscape) {
        setEmojiPosition('center'); // em celular em pé
      } else {
        setEmojiPosition('right-center'); // desktop
      }
    };

    updateEmojiPosition();

    window.addEventListener('resize', updateEmojiPosition);
    window.addEventListener('orientationchange', updateEmojiPosition);

    return () => {
      window.removeEventListener('resize', updateEmojiPosition);
      window.removeEventListener('orientationchange', updateEmojiPosition);
    };
  }, []);

  const handleEmojiSelect = (emoji) => {
    setRelato(prevMessage => prevMessage + emoji);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (enviando) return;

    setEnviando(true);

    try {
      const dadosRelato = { titulo, categoria, texto: relato, anonimo };
      let response;

      if (relatoEditando) {
        response = await api.put(`/relatos/${relatoEditando.id}`, dadosRelato);
      } else {
        response = await api.post('/relatos/criarRelato', dadosRelato);
      }

      const data = response.data;
      setRelato('');
      setTitulo('');
      setCategoria('');
      setAnonimo(false);

      if (onSubmit) onSubmit(data, relatoEditando ? 'editado' : 'criado');
      onCancel();

      toast.success(relatoEditando ? 'Relato editado com sucesso!' : 'Relato enviado com sucesso!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao enviar relato';
      toast.error(errorMessage);
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
              placeholder="Descreva seu relato com detalhes..."
              value={relato}
              onChange={(e) => setRelato(e.target.value)}
              rows={6}
              required
              disabled={enviando}
            />
          </div>
          
          <EmojiPicker onEmojiSelect={handleEmojiSelect} position={emojiPosition} />

          <div className="form-group anonimo-checkbox">
            <label>
              <input
                type="checkbox"
                checked={anonimo}
                onChange={(e) => setAnonimo(e.target.checked)}
                disabled={enviando}
              />
              Compartilhar de forma anônima
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onCancel} disabled={enviando}>
              Cancelar
            </button>
            <button type="submit" className="submit-button" disabled={enviando}>
              {enviando ? 'Enviando...' : (relatoEditando ? 'Atualizar Relato' : 'Enviar Relato')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RelatoForm;
