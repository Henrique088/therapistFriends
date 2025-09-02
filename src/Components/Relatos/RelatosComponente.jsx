import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import './RelatosComponente.css';
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import { MdEdit, MdDelete } from "react-icons/md";
import { formatarData } from '../../Utils/index';
import { darLikeNoRelato } from '../../Utils/likeUtils';
import { useUser } from '../../contexts/UserContext';
import RelatoForm from '../../Components/FormularioRelatos/FormularioRelatos';

export default function ExibirRelatos({ numRelatos, relatosPessoais, recarregar, tagsSelecionadas = [] }) {
  let [relatos, setRelatos] = useState([]);
  const [relatoEditando, setRelatoEditando] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loadingLikeId, setLoadingLikeId] = useState(null);
  const { usuario } = useUser();
  
  console.log('Recarregar relatos:', recarregar);
  console.log('Tags selecionadas:', tagsSelecionadas);
 
  const carregarRelatos = () => {
    fetch('http://localhost:3001/relatos/', {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setRelatos(data);
        if(relatosPessoais){
          const relatosUsuario = data.filter((relato) => 
            relato.paciente.id_usuario === usuario.id
          );
          setRelatos(relatosUsuario);
        }
      })
      .catch((err) => console.error('Erro ao buscar relatos:', err));
  };

  useEffect(() => {
    carregarRelatos();
  }, [recarregar]); 

  // ✅ FILTRAGEM DOS RELATOS BASEADO NAS TAGS SELECIONADAS
  let relatosFiltrados = useMemo(() => {
    if (!tagsSelecionadas || tagsSelecionadas.length === 0) {
      return relatos; // Retorna todos se não houver filtros
    }

    if (tagsSelecionadas.includes('Disponivéis') && usuario.tipo_usuario === 'profissional' && tagsSelecionadas.length === 1) {
      relatos = relatos.filter(relato => !relato.profissional_id);
      return relatos;
    }else{
      relatos = relatos.filter(relato => !relato.profissional_id);
    }

    console.log('Relatos antes da filtragem:', relatos);

    return relatos.filter(relato => {
      // Verifica se o relato tem pelo menos uma das tags selecionadas
      return tagsSelecionadas.some(tag => {
        // Busca em múltiplos campos do relato
        return (
          relato.categoria?.toLowerCase().includes(tag.toLowerCase()) ||
          relato.titulo?.toLowerCase().includes(tag.toLowerCase()) ||
          relato.texto?.toLowerCase().includes(tag.toLowerCase()) ||
          (relato.resultado_ia && relato.resultado_ia.toLowerCase().includes(tag.toLowerCase())) ||
          (relato.paciente?.codinome && relato.paciente.codinome.toLowerCase().includes(tag.toLowerCase()))
        // (!relato.profissional_id && 'Disponivéis'.toLowerCase().includes(tag.toLowerCase())))
        
        );
        
      });

      
    });
  }, [relatos, tagsSelecionadas]);

  //filtrar relatosFiltrados se a tag "Disponivéis" estiver selecionada e o usuario for profissional
   
   

  const darLike = async (relato_id) => {
    if (loadingLikeId === relato_id) return;
    setLoadingLikeId(relato_id);
    const resultado = await darLikeNoRelato(relato_id);

    if (resultado.sucesso) {
      setRelatos((prevRelatos) =>
        prevRelatos.map((r) =>
          r.id === relato_id
            ? { ...r, quantidadeLikes: resultado.quantidadeLikes, jaCurtiu: resultado.liked }
            : r
        )
      );
      console.log('Like atualizado:', resultado.mensagem);
    } else {
      console.error('Erro ao curtir:', resultado.erro);
    }
    setLoadingLikeId(null);
  };

  const editarRelato = (relato) => {
    setRelatoEditando(relato);
    setShowForm(true);
  };

  const deletarRelato = async (relatoId) => {
    try {
      const response = await fetch(`http://localhost:3001/relatos/${relatoId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.status === 204) {
        setRelatos((prev) => prev.filter((r) => r.id !== relatoId));
        toast.success('Relato excluído com sucesso!');
      } else {
        const erro = await response.json();
        toast.error('Erro ao deletar: ' + erro.erro);
      }
    } catch (error) {
      console.error('Erro ao deletar relato:', error);
      toast.error('Erro ao deletar o relato.');
    }
  };

  const deletarRelatoComConfirmacao = (relatoId) => {
    toast.info(
      ({ closeToast }) => (
        <div>
          <p><strong>Deseja realmente excluir este relato?</strong></p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              style={{ background: 'red', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer'}}
              onClick={() => {
                deletarRelato(relatoId);
                closeToast();
              }}
            >
              Sim
            </button>
            <button
              style={{ background: '#ccc', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer' }}
              onClick={closeToast}
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  const handleCancel = () => {
    setShowForm(false);
    setRelatoEditando(null);
  };

  const handleSubmit = (formData) => {
    setRelatos(prev => prev.map(r => 
      r.id === formData.id ? { ...r, ...formData } : r
    ));
    console.log('Dados do relato:', formData);
    setShowForm(false);
  };

  const entrarEmContato = (relato) => {
    if (usuario.tipo_usuario === 'paciente') {
      toast.info('Você não pode entrar em contato com relatos de pacientes.');
      return; 
    }
    if (relato.profissional_id) {
      toast.info('Este relato já está vinculado a um profissional.');
      return; 
    }

    fetch('http://localhost:3001/solicitacoes/solicitarConversa', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pacienteId: relato.paciente.id_usuario, 
        relatoId: relato.id,
      }),
    })
      .then(async (resp) => {
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.erro || 'Erro ao solicitar conversa');
        toast.success('Solicitação de conversa enviada com sucesso!');
      })
      .catch((err) => {
        toast.error(err.message);
        console.error(err);
      });
  };

  return (  
    <div className="posts-container">
      {showForm && <RelatoForm onCancel={handleCancel} onSubmit={handleSubmit} relatoEditando={relatoEditando} />}
      
      {/* ✅ MOSTRA MENSAGEM QUANDO NÃO HÁ RELATOS FILTRADOS */}
      {relatosFiltrados.length === 0 ? (
        <div className="no-results">
          {tagsSelecionadas.length > 0 ? (
            <p>Nenhum relato encontrado para as tags selecionadas.</p>
          ) : (
            <p>Você ainda não fez nenhum relato.</p>
          )}
        </div>
      ) : (
       
        relatosFiltrados.map((relato) => (
          <div key={relato.id} className={`post-card ${relato.resultado_ia || ''}`}>
            <div className="post-header">
              <div className="user-info">
                <div className="user-avatar">
                  {relato?.paciente?.codinome.substring(0, 2)}
                </div>
                <div className="username">{relato?.paciente.codinome}</div>
              </div>
              <div className="post-time">{formatarData(relato?.data_envio)}</div>
            </div>
            <div className='titulo-relato'>{relato?.titulo}</div>
            <div className="post-content">{relato?.texto}</div>
            <div className="post-actions">
              <div className='like-contat'> 
                <button
                  className="like-button"
                  onClick={() => darLike(relato.id)}
                  disabled={loadingLikeId === relato.id}
                >
                  {loadingLikeId === relato.id ? (
                    <span>...</span>
                  ) : (
                    <>
                      {relato.jaCurtiu ? <FcLike size={20} /> : <FcLikePlaceholder size={20} />}
                      <span style={{ marginLeft: '6px' }}>{relato.quantidadeLikes || 0}</span>
                    </>
                  )}
                </button>
                {relato.profissional_id === null && usuario.tipo_usuario === 'profissional' && (
                  <button onClick={() => entrarEmContato(relato)}>
                    <span>Entrar em contato</span>
                  </button>
                )}
              </div>
              {relato.paciente.id_usuario === usuario.id && (
                <div className="post-actions-extra">
                  <button onClick={() => editarRelato(relato)}>
                    <MdEdit size={20} style={{ marginRight: '5px' }} />
                    Editar
                  </button>
                  <button onClick={() => deletarRelatoComConfirmacao(relato.id)}>
                    <MdDelete size={20} style={{ marginRight: '5px' }} />
                    Excluir
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}