import React, { useState, useEffect} from 'react';
import { useUser } from '../../contexts/UserContext';
import MenuLateral from '../../Components/Menu/MenuLateral';
import './Perfil.css';
import image_default from '../../img/imagem_default.png';
import { toast } from 'react-toastify';
import api from '../../api/apiConfig'; 

export default function PerfilProfissional() {
    const { usuario, fetchUsuario } = useUser();
    const [salvando, setSalvando] = useState(false);
    const [editando, setEditando] = useState(false);

    const [form, setForm] = useState({
        nome: usuario?.nome || '',
        telefone: usuario?.telefone || '',
        cpf: usuario?.cpf || '',
        crp: usuario?.crp || '',
        bio: usuario?.bio || '',
        especialidades: usuario?.especialidades || ''
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
            nome: usuario?.nome || '',
            telefone: usuario?.telefone || '',
            cpf: usuario?.cpf || '',
            crp: usuario?.crp || '',
            bio: usuario?.bio || '',
            especialidades: usuario?.especialidades || ''
        });
    }, [editando, usuario]);

    const atualizarDados = async (e) => {
        e.preventDefault();
        
        // Validações
        const dadosAtualizados = {
            bio: form.bio.trim() || usuario.bio,
            telefone: form.telefone.trim() || usuario.telefone,
            nome: form.nome.trim() || usuario.nome,
            cpf: form.cpf.trim() || usuario.cpf,
            crp: form.crp.toUpperCase() || usuario.crp,
            especialidades: form.especialidades.split(',').map(e => e.trim()).filter(e => e).join(', ') || usuario.especialidades
        };

        // Validações adicionais
        if (!dadosAtualizados.bio.trim()) {
            toast.error('A bio é obrigatória');
            return;
        }

        if (!dadosAtualizados.especialidades.trim()) {
            toast.error('As especialidades são obrigatórias');
            return;
        }

        setSalvando(true);

        try {
            const response = await api.post('/profissionais', dadosAtualizados);
            
            localStorage.setItem('info', JSON.stringify(response.data.info));
            toast.success('Dados atualizados com sucesso!');
            
            fetchUsuario(); // Atualiza o usuário no contexto
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

                <div className="cardPerfil_2">
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
                                <p><strong>CPF:</strong> {usuario?.cpf}</p>
                                <p><strong>CRP:</strong> {usuario?.crp}</p>
                                <p><strong>Bio:</strong> {usuario?.bio}</p>
                                <p><strong>Especialidades:</strong> {usuario?.especialidades}</p>
                                
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
                                    name="cpf" 
                                    value={form.cpf} 
                                    onChange={handleChange} 
                                    placeholder="CPF" 
                                    readOnly 
                                    className='ler' 
                                />
                                <input 
                                    type="text" 
                                    name="crp" 
                                    value={form.crp} 
                                    onChange={handleChange} 
                                    placeholder="CRP (ex: CRP-12/12345)" 
                                    readOnly 
                                    className='ler'
                                />
                                <input 
                                    type="text" 
                                    name="especialidades" 
                                    value={form.especialidades} 
                                    onChange={handleChange} 
                                    placeholder="Especialidades (separadas por vírgula)" 
                                />
                                <textarea
                                    name="bio"
                                    placeholder="Fale um pouco sobre você..."
                                    value={form.bio}
                                    onChange={handleChange}
                                    required
                                />
                                <button type="submit" disabled={salvando}>
                                    {salvando ? 'Salvando...' : 'Salvar'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>      
            </div>
        </div>
    );
}