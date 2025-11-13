import React, { useState, useEffect } from 'react';
import './Relatos.css';
import MenuLateral from '../../Components/Menu/MenuLateral';
import ExibirRelatos from '../../Components/Relatos/RelatosComponente';
import RelatoForm from '../../Components/FormularioRelatos/FormularioRelatos';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '../../contexts/UserContext';
import { formatarData } from '../../Utils';
import { ta } from 'date-fns/locale';
import { MdOutlineQuestionMark } from "react-icons/md";
import { PiWarningDuotone } from "react-icons/pi";
import { TbTargetArrow } from "react-icons/tb";
import { FaLightbulb } from "react-icons/fa";
import { RiCloseFill } from "react-icons/ri";
const Relatos = () => {
  const [showForm, setShowForm] = useState(false);
  const [relatos, setRelatos] = useState([]);
  const [relatoEditando, setRelatoEditando] = useState(null);
  const [recarregarRelatos, setRecarregarRelatos] = useState(0);
  const [showModalInfo, setShowModalInfo] = useState(false); 
  const { usuario } = useUser();

  // Estado para as tags selecionadas
  const [tagsSelecionadas, setTagsSelecionadas] = useState([]);

  // Tags disponíveis para o filtro
  let tagsDisponiveis = ['Ansiedade', 'Depressão', 'Estresse', 'Felicidade', 'Tristeza', 'Raiva', 'Medo', 'Solidão', 'Esperança', 'Culpa', 'Vergonha', 'Alívio', 'Gratidão', 'Frustração', 'Confiança', 'Insegurança'];

  //se usuario for profissional colocar Disponiveis na tagsSelecionadas
  if (usuario?.tipo_usuario === 'profissional') {
    tagsDisponiveis.push('Disponivéis','Grave', 'Moderado', 'Leve');
  }


  const handleTagClick = (tag) => {
    if (tagsSelecionadas.includes(tag)) {
      setTagsSelecionadas(tagsSelecionadas.filter(t => t !== tag));
    } else {
      setTagsSelecionadas([...tagsSelecionadas, tag]);
    }
    setRecarregarRelatos(prev => prev + 1);
  };


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


  const toggleModalInfo = () => {
    setShowModalInfo(!showModalInfo);
  };

  return (
    <div className="app-container">
      <MenuLateral />

      <div className="main-content">
        <div className='criarDesabafo-tags'>
          <h1 className="titulo-pagina">Relatos da Comunidade</h1>
          
          {usuario?.tipo_usuario === 'paciente' ? (
            <button className="create-post-button" onClick={createNewPost}>
              + Criar Desabafo
            </button>
          ) : ( 
            <div className="table-container">
              <table>
                <thead></thead>
                <tbody>
                  <tr>
                    <td><span className="indicativo leve"></span> Leve</td>
                    <td><span className="indicativo mediano"></span> Mediano</td>
                    
                  </tr>
                  <tr>
                    <td><span className="indicativo grave"></span> Grave</td>
                    <td><span className="indicativo indeterminado"></span> Indeterminado</td>
                  </tr>
                </tbody>
              </table>
              
              {/* Botão de informação */}
              <button 
                className="info-button"
                onClick={toggleModalInfo}
                title="Informações sobre a classificação"
              >
                <MdOutlineQuestionMark/>
              </button>
            </div>
          )}
        </div>

        {/* Modal de Informação */}
        {showModalInfo && (
          <div className="modal-overlay" onClick={toggleModalInfo}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Sobre a Classificação dos Relatos</h2>
                <button className="modal-close" onClick={toggleModalInfo}><RiCloseFill/></button>
              </div>
              
              <div className="modal-body">
                <p>
                  <strong>Os níveis de gravidade (Leve, Moderado, Grave) são classificados automaticamente por Inteligência Artificial</strong> com base na análise do conteúdo dos relatos.
                </p>
                
                <div className="info-section">
                  <h3><PiWarningDuotone/> Importante:</h3>
                  <ul>
                    <li>Esta classificação é <strong>apenas uma ferramenta auxiliar</strong></li>
                    <li>Não substitui a avaliação profissional</li>
                    <li>Pode conter imprecisões</li>
                    <li>Serve como triagem inicial</li>
                  </ul>
                </div>

                <div className="info-section">
                  <h3><TbTargetArrow/> Objetivo:</h3>
                  <ul>
                    <li>Agilizar a identificação de casos prioritários</li>
                    <li>Fornecer insights iniciais</li>
                    <li>Organizar visualmente os relatos</li>
                  </ul>
                </div>

                <div className="info-important">
                  <p>
                    <strong><FaLightbulb/> A avaliação final deve sempre ser realizada por um profissional de saúde mental qualificado.</strong>
                  </p>
                </div>
              </div>
              
              <div className="modal-footer">
                <button className="modal-ok-button" onClick={toggleModalInfo}>
                  Entendi
                </button>
              </div>
            </div>
          </div>
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

          <p className="disponiveis-text">Tags disponíveis:</p>
          <div className="tags-disponiveis">
            {tagsDisponiveis.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`tags-dispo ${tagsSelecionadas.includes(tag)
                  ? 'bg-gray-400 text-gray-800 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                disabled={tagsSelecionadas.includes(tag)}
              >
                {tag}
              </button>
            ))}
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