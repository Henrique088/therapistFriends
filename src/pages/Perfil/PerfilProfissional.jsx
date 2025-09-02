import React, { useState, useEffect} from 'react';
import { useUser } from '../../contexts/UserContext';
import MenuLateral from '../../Components/Menu/MenuLateral';
import './Perfil.css';
import image_default from '../../img/imagem_default.png';
import { toast } from 'react-toastify';

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
        form.bio = usuario.bio;
        form.telefone = usuario.telefone;
        form.nome = usuario.nome;
        form.cpf = usuario.cpf;
        form.crp = usuario.crp;
        form.especialidades = usuario.especialidades;
        
      } ,[editando]);

    const atualizarDados = (e) => {
        e.preventDefault();
        if (!form.especialidades.trim()) {
            form.especialidades = usuario.especialidades;
        }
        if (!form.telefone.trim()) {
            form.telefone = usuario.telefone;
        }

        if (!form.nome.trim()) {
            form.nome = usuario.nome;
        }

        if (!form.bio.trim()) {
            form.bio = usuario.bio;
        }

        if (!form.especialidades.trim()) {
            form.especialidades = usuario.especialidades;
        }

       

        fetch('http://localhost:3001/profissionais', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                bio: form.bio.trim(),
                telefone: form.telefone.trim(),
                nome: form.nome.trim(),
                cpf: form.cpf.trim(),
                crp: form.crp.toUpperCase(),
                especialidades: form.especialidades.split(',').map(e => e.trim()).filter(e => e).join(', ')
            }),
        })
            .then(async (resp) => {
                const data = await resp.json();
                if (!resp.ok) throw new Error(data.erro || 'Erro ao salvar');
                localStorage.setItem('info', JSON.stringify(data.info));
                toast.success('Dados atualizados com sucesso!');
                // refresh na pagina ou atualizar o estado do usuário
                // window.location.reload();
                fetchUsuario(); // Atualiza o usuário no contexto
               
                
                setEditando(false);
               
            })
            .catch((err) => {
                toast.error(err.message);
                console.error(err);
            })
            .finally(() => setSalvando(false));
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
                                <p><strong>Nome:</strong> {usuario.nome}</p>
                                <p><strong>Telefone:</strong> {formatarTelefone(usuario.telefone)}</p>
                                <p><strong>CPF:</strong> {usuario.cpf}</p>
                                <p><strong>CRP:</strong> {usuario.crp}</p>
                                <p><strong>Bio:</strong> {usuario.bio}</p>
                                <p><strong>Especialidades:</strong> {usuario.especialidades}</p>
                                
                            </div>
                        ) : (
                            <form onSubmit={atualizarDados} className="formEditar">
                                <input type="text" name="nome" value={form.nome} onChange={handleChange} placeholder="Nome" />
                                <input type="text" name="telefone" value={formatarTelefone(form.telefone)} onChange={handleChange} placeholder="Telefone" />
                                <input type="text" name="cpf" value={form.cpf} onChange={handleChange} placeholder="CPF" readOnly className='ler' />
                                <input type="text" name="crp" value={form.crp} onChange={handleChange} placeholder="CRP (ex: CRP-12/12345)" readOnly className='ler'/>
                                <input type="text" name="especialidades" value={form.especialidades} onChange={handleChange} placeholder="Especialidades" />
                                <textarea
                                    name="bio"
                                    placeholder="Fale um pouco sobre você..."
                                    value={form.bio}
                                    onChange={handleChange}
                                    required
                                />
                                <button type="submit" disabled={salvando}>Salvar</button>
                            </form>
                        )}
                    </div>
                </div>      
            </div>
        </div>
    );
}
