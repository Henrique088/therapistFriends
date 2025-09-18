import React from 'react';
import { CiShare2 } from 'react-icons/ci'; // Importe o ícone que você está usando
import './Compartilhar.css'; // Crie este arquivo CSS para estilizar
import { useUser } from '../../contexts/UserContext';

const Compartilhar = () => {
  const { usuario } = useUser();
  const url = `http://localhost:3000/agenda-paciente/${usuario.id}/${usuario.nome}`;
  const textoCompartilhar = `Confira a agenda de ${usuario.nome} em: ${url}`;
    

  const handleClick = () => {
    // Verifica se a API Web Share está disponível no navegador
    if (navigator.share) {
      navigator.share({
        title: 'Compartilhar Agenda',
        text: textoCompartilhar,
        url: url,
      }).then(() => {
        console.log('Compartilhado com sucesso!');
      }).catch((error) => {
        console.error('Erro ao compartilhar:', error);
      });
    } else {
      // Fallback para navegadores que não suportam a API Web Share
      console.log('API de compartilhamento não suportada, copiando link para a área de transferência.');
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copiado para a área de transferência!');
      }).catch((err) => {
        console.error('Erro ao copiar o link:', err);
      });
    }
  };

  return (
    <div className="compartilhar-container">
      <h2 className="compartilhar-titulo">
        Compartilhar
        <button onClick={handleClick} className="compartilhar-botao">
          <CiShare2 title="Compartilhar agenda" className="compartilhar-icone" />
        </button>
      </h2>
    </div>
  );
};

export default Compartilhar;