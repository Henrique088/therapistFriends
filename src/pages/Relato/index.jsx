import React, { useState, useEffect } from 'react';
import './Relatos.css';
import MenuLateral from '../../Components/Menu/MenuLateral';
import ExibirRelatos from '../../Components/Relatos/RelatosComponente';
import RelatoForm from '../../Components/FormularioRelatos/FormularioRelatos';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '../../contexts/UserContext';
import { formatarData } from '../../Utils';

const Relatos = () => {
  const [showForm, setShowForm] = useState(false);
  const [relatos, setRelatos] = useState([]); // ✅ Mudado para array vazio
  const [relatoEditando, setRelatoEditando] = useState(null);
  const [recarregarRelatos, setRecarregarRelatos] = useState(0);
  const { usuario } = useUser();

  // Estado para as tags selecionadas
  const [tagsSelecionadas, setTagsSelecionadas] = useState([]);

  // Tags disponíveis para o filtro
  let tagsDisponiveis = ['Grave', 'Leve', 'Mediano'];

  //se usuario for profissional colocar Disponiveis na tagsSelecionadas
  if (usuario?.tipo_usuario === 'profissional') {
    tagsDisponiveis.push('Disponivéis');
  }

  // ✅ Função para lidar com a seleção e deseleção das tags
  const handleTagClick = (tag) => {
    // Verifica se a tag já está selecionada
    if (tagsSelecionadas.includes(tag)) {
      // Se estiver, remove a tag da lista
      setTagsSelecionadas(tagsSelecionadas.filter(t => t !== tag));
    } else {
      // Se não estiver, adiciona a tag à lista
      setTagsSelecionadas([...tagsSelecionadas, tag]);
    }
    // Dispara a recarga dos relatos com as novas tags
    setRecarregarRelatos(prev => prev + 1);
  };

  // ✅ Função para remover uma tag específica
  const handleRemoveTag = (tagToRemove) => {
    setTagsSelecionadas(tagsSelecionadas.filter(tag => tag !== tagToRemove));
    setRecarregarRelatos(prev => prev + 1);
  };

  const handleCancel = () => {
    setShowForm(false);
    setRelatoEditando(null);
    console.log('Formulário cancelado');
  };


  const handleSubmit = () => {


    setRecarregarRelatos(prev => prev + 1);

    setShowForm(false);
    setRelatoEditando(null);
  };

  const createNewPost = () => {
    setShowForm(true);
    setRelatoEditando(null);
  };

  return (
    <div className="app-container">
      <MenuLateral />

      <div className="main-content">
        <h1 className="titulo-pagina">Relatos da Comunidade</h1>
        <div className='criarDesabafo-tags'>
          {usuario?.tipo_usuario === 'paciente' && (
            <button className="create-post-button" onClick={createNewPost}>
              + Criar Desabafo
            </button>
          )}

          <div className="tags">

            <p className="tags-title">Tags selecionadas:</p>
            <div className="tags-selecionadas">
              {tagsSelecionadas.length > 0 ? (
                tagsSelecionadas.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleRemoveTag(tag)}
                    className="tag-selecionada"
                  >
                    {tag}
                    <span className="font-bold text-sm">x</span>
                  </button>
                ))
              ) : (
                <span className="text-sm text-gray-500 italic">Nenhuma tag selecionada.</span>
              )}
            </div>

            {/* ✅ Tags disponíveis para seleção */}
            <p className="disponiveis-text">Tags disponíveis:</p>
            <div className="tags-disponiveis">
              {tagsDisponiveis.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`tags-dispo ${tagsSelecionadas.includes(tag)
                    ? 'bg-gray-400 text-gray-800 cursor-not-allowed' // Estilo para tag selecionada
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300' // Estilo para tag não selecionada
                    }`}
                  disabled={tagsSelecionadas.includes(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>


        {showForm && (
          <RelatoForm
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            relatoEditando={relatoEditando}
          />
        )}


        <ExibirRelatos recarregar={recarregarRelatos} tagsSelecionadas={tagsSelecionadas} />
      </div>
    </div>
  );
};

export default Relatos;