import React, { useState, useEffect} from 'react';
import { useUser } from '../../contexts/UserContext';
import MenuLateral from '../../Components/Menu/MenuLateral';
import './Perfil.css';
import image_default from '../../img/imagem_default.png';
import ExibirRelatos from '../../Components/Relatos/RelatosComponente';
import { toast } from 'react-toastify';
import api from '../../api/apiConfig'; 

export default function PerfilPaciente() {
    const { usuario, fetchUsuario } = useUser();
    const [salvando, setSalvando] = useState(false);
    const [editando, setEditando] = useState(false);

    const [form, setForm] = useState({
        nome: usuario?.nome || '',
        telefone: usuario?.telefone || '',
        codinome: usuario?.codinome || ''
    });

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        toast.success('Perfil atualizado com sucesso!'+ form.codinome + ' ' + form.telefone + ' ' + form.nome);
        
        setEditando(false);
    };

    const formatarTelefone = (telefone) => {
    return telefone
      .replace(/\D/g, '')
      .replace(/(\d{0})(\d)/, '$1$2')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  };


    useEffect(() => {
        setForm({
            codinome: usuario?.codinome || '',
            telefone: usuario?.telefone || '',
            nome: usuario?.nome || ''
        });
    }, [editando, usuario]);

    const atualizarDados = async (e) => {
        e.preventDefault();
        
        // Validações
        const dadosAtualizados = {
            codinome: form.codinome.trim() || usuario.codinome,
            telefone: form.telefone.trim() || usuario.telefone,
            nome: form.nome.trim() || usuario.nome,
        };

        if (dadosAtualizados.codinome.trim().length < 3) {
            toast.error('Codinome deve ter pelo menos 3 caracteres');
            return;
        }

        setSalvando(true);

        try {
            const response = await api.post('/pacientes', dadosAtualizados);
            
            localStorage.setItem('info', JSON.stringify(response.data.info));
            toast.success('Dados atualizados com sucesso!');
            
            fetchUsuario();
            setEditando(false);
               
        } catch (error) {
            const errorMessage = error.response?.data?.erro || 'Erro ao salvar dados';
            toast.error(errorMessage);
            console.error('Erro ao atualizar perfil:', error);
        } finally {
            setSalvando(false);
        }
    };

    return (
        <div className="containerPerfil">
            <MenuLateral />

            <div className="conteudoPerfil">
                <div className="headerPerfil">
                    <button onClick={() => setEditando(false)} className={!editando ? 'ativo' : ''}>Ver Perfil</button>
                    <button onClick={() => setEditando(true)} className={editando ? 'ativo' : ''}>Editar Perfil</button>
                </div>

                <div className="cardPerfil">
                    <div className="bgPerfil"></div>
                    <div className="blobPerfil"></div>

                    <div className="conteudoCard">
                        <div className="fotoPerfil">
                            <img src={usuario?.foto || image_default} alt="Foto de Perfil" className="fotoUsuario" />
                        </div>

                        {!editando ? (
                            <div className="dadosUsuario">
                                <p><strong>Nome:</strong> {usuario?.nome}</p>
                                <p><strong>Telefone:</strong> {usuario?.telefone ? formatarTelefone(usuario.telefone) : ''}</p>
                                <p><strong>Codinome:</strong> {usuario?.codinome}</p>
                            </div>
                        ) : (
                            <form onSubmit={atualizarDados} className="formEditar">
                                <input 
                                    type="text" 
                                    name="nome" 
                                    value={form.nome} 
                                    onChange={handleChange} 
                                    placeholder="Nome" 
                                />
                                <input 
                                    type="text"  
                                    name="telefone" 
                                    value={formatarTelefone(form.telefone)} 
                                    onChange={handleChange} 
                                    placeholder="Telefone" 
                                />
                                <input 
                                    type="text" 
                                    name="codinome" 
                                    value={form.codinome} 
                                    onChange={handleChange} 
                                    placeholder="Codinome" 
                                />
                                <button type="submit" disabled={salvando}>
                                    {salvando ? 'Salvando...' : 'Salvar'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="relatosUsuario">
                    <h2>Seus Relatos</h2>
                    <ExibirRelatos numRelatos={5} relatosPessoais={true} />
                </div>
            </div>
        </div>
    );
}