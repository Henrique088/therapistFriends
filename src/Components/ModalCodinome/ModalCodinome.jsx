// import { useState, useEffect } from 'react';

// import { jwtDecode } from 'jwt-decode';
// import Modal from 'react-modal';
// import { toast } from 'react-toastify';
// import './ModalCodinome.css'; 

// Modal.setAppElement('#root'); // Para acessibilidade, evita problemas com leitores de tela

// export default function ModalCodinome() {
//   const [showModal, setShowModal] = useState(false);
//   const [codinome, setCodinome] = useState('');
//   const token = localStorage.getItem('token');
//   const decoded = jwtDecode(token);
//   const userId = decoded.id;  


//   const salvarCodinome = () => {
//     if (codinome.trim().length < 3) {
//       toast.warn('O codinome deve ter pelo menos 3 caracteres.');
//       return;
//     }

//     axios.put(`http://localhost:8000/api/pacientes/${userId}/`, {
//       codinome: codinome.trim()
//     })
//       .then(() => {
//         toast.success('Codinome salvo com sucesso!');
//         setShowModal(false);
//       })
//       .catch(err => {
//         toast.error('Erro ao salvar codinome.');
//         console.error(err);
//       });
//   };

//   return (
//     <Modal
//       isOpen={showModal}
//       contentLabel="Defina seu Codinome"
//       className="modal"
//       overlayClassName="overlay"
//     >
//       <h2>Escolha seu codinome</h2>
//       <p>Esse será seu nome anônimo visível aos profissionais.</p>
//       <input
//         type="text"
//         value={codinome}
//         onChange={e => setCodinome(e.target.value)}
//         placeholder="Ex: Viajante da Lua"
//       />
//       <button onClick={salvarCodinome}>Salvar</button>
//     </Modal>
//   );
// }
