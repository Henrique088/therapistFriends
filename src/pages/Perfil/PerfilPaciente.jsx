import React, { useState, useEffect} from 'react';
import { useUser } from '../../contexts/UserContext';
import MenuLateral from '../../Components/Menu/MenuLateral';
import './Perfil.css';
import image_default from '../../img/imagem_default.png';
import ExibirRelatos from '../../Components/Relatos/RelatosComponente';
import { toast } from 'react-toastify';

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
        form.codinome = usuario.codinome;
        form.telefone = usuario.telefone;
        form.nome = usuario.nome;
        
      } ,[editando]);

    const atualizarDados = (e) => {
        e.preventDefault();
        if (form.codinome.trim().length < 3 ) {
            form.codinome = usuario.codinome;
        }
        if (!form.telefone.trim()) {
            form.telefone = usuario.telefone;
        }

        if (!form.nome.trim()) {
            form.nome = usuario.nome;
        }

       

        fetch('http://localhost:3001/pacientes', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                codinome: form.codinome.trim(),
                telefone: form.telefone.trim(),
                nome: form.nome.trim(),
            }),
        })
            .then(async (resp) => {
                const data = await resp.json();
                if (!resp.ok) throw new Error(data.erro || 'Erro ao salvar');
                localStorage.setItem('info', JSON.stringify(data.info));
                toast.success('Dados atualizados com sucesso!');
                // refresh na pagina ou atualizar o estado do usuário
                // window.location.reload();
                fetchUsuario();
                // ou setUser(data.info) se você tiver um contexto de usuário
                
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

                <div className="cardPerfil">
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
                                <p><strong>Codinome:</strong> {usuario.codinome}</p>
                            </div>
                        ) : (
                            <form onSubmit={atualizarDados} className="formEditar">
                                <input type="text" name="nome" value={form.nome} onChange={handleChange} placeholder="Nome" />
                                <input type="text"  name="telefone" value={formatarTelefone(form.telefone)} onChange={handleChange} placeholder="Telefone" />
                                <input type="text" name="codinome" value={form.codinome} onChange={handleChange} placeholder="Codinome" />
                                <button type="submit" disabled={salvando}>Salvar</button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="relatosUsuario">
                    <h2>Seus Relatos</h2>
                    <ExibirRelatos numRelatos={5} relatosPessoais={true} />
                    {/* Aqui você renderiza os relatos do usuário */}
                </div>
            </div>
        </div>
    );
}
