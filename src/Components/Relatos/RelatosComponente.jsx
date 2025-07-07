import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './RelatosComponente.css';
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import { MdEdit, MdDelete } from "react-icons/md";
import { formatarData } from '../../Utils/index';
import { darLikeNoRelato } from '../../Utils/likeUtils';
import { useUsuario } from '../../contexts/UserContext';
import RelatoForm from '../../Components/FormularioRelatos/FormularioRelatos';



export default function ExibirRelatos({ numRelatos }) {
  const [relatos, setRelatos] = useState([]);
  const [relatoEditando, setRelatoEditando] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loadingLikeId, setLoadingLikeId] = useState(null);
  const { usuario } = useUsuario();

 
useEffect(() => {
    fetch('http://localhost:3001/relatos/', {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {

        if (numRelatos && numRelatos > 0) {
            const relatosRecentes = data
          .sort((a, b) => new Date(b.data_envio) - new Date(a.data_envio))
          .slice(0, numRelatos);

        setRelatos(relatosRecentes);
        console.log('Relatos:', JSON.stringify(data, null, 2));
        }
        else{
            setRelatos(data);
        }
        
      })
      .catch((err) => console.error('Erro ao buscar relatos:', err));
  }, []);


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
                closeToast(); // Fecha o toast de confirmação
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
    console.log('Dados do relato:', formData);
    setShowForm(false);
  };
  return (

    
    <div className="posts-container">
        {showForm && <RelatoForm onCancel={handleCancel} onSubmit={handleSubmit} relatoEditando={relatoEditando} />}
              {relatos.map((relatos) => (
                <div key={relatos.id} className="post-card">
                  <div className="post-header">
                    <div className="user-info">
                      <div className="user-avatar">
                        {relatos?.paciente.codinome.substring(0, 2)}
                      </div>
                      <div className="username">{relatos?.paciente.codinome}</div>
                    </div>
                    <div className="post-time">{formatarData(relatos?.data_envio)}</div>
                  </div>
                  <div className="post-content">{relatos?.texto}</div>
                  <div className="post-actions">
                    <button
                      className="like-button"
                      onClick={() => darLike(relatos.id)}
                      disabled={loadingLikeId === relatos.id}
                    >
                      {loadingLikeId === relatos.id ? (
                        <span>...</span>
                      ) : (
                        <>
                          {relatos.jaCurtiu ? <FcLike size={20} /> : <FcLikePlaceholder size={20} />}
                          <span style={{ marginLeft: '6px' }}>{relatos.quantidadeLikes || 0}</span>
                        </>
                      )}
                    </button>
    
                    {relatos.paciente.id_usuario === usuario.id && (
                      <div className="post-actions-extra">
                        <button onClick={() => editarRelato(relatos)}>
                          <MdEdit size={20} style={{ marginRight: '5px' }} />
                          Editar
                        </button>
                        <button onClick={() => deletarRelatoComConfirmacao(relatos.id)}>
                          <MdDelete size={20} style={{ marginRight: '5px' }} />
                          Excluir
                        </button>
                      </div>
                    )}
                  </div>
    
    
                </div>
              ))}
            </div>
  );
}
