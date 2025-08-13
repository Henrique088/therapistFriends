import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import moment from 'moment';
import './ModalDisponibilidade.css';

// Configura o elemento principal da aplicação para acessibilidade
Modal.setAppElement('#root'); // Altere '#root' se o seu id for diferente

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px', // Defina a largura do modal
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    border: '1px solid #ccc'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  }
};

const ModalDisponibilidade = ({ 
  visible, 
  onClose, 
  onSalvar, 
  onBloquear,
  slot,
  loading 
}) => {
  const [formData, setFormData] = useState({
    inicio: slot ? moment(slot.start) : moment().startOf('hour'),
    fim: slot ? moment(slot.end) : moment().startOf('hour').add(1, 'hour'),
    tipo: 'disponivel'
  });

  useEffect(() => {
    if (slot) {
      setFormData({
        inicio: moment(slot.start),
        fim: moment(slot.end),
        tipo: 'disponivel'
      });
    }
  }, [slot]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (field, timeString) => {
    const time = moment(timeString, 'HH:mm');
    setFormData(prev => ({ ...prev, [field]: time }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.tipo === 'bloqueado') {
      onBloquear({
        inicio: formData.inicio.toDate(),
        fim: formData.fim.toDate()
      });
    } else {
      onSalvar({
        inicio: formData.inicio.toDate(),
        fim: formData.fim.toDate(),
        tipo: formData.tipo
      });
    }
  };

  return (
    <Modal
      isOpen={visible}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Adicionar Horário"
    >
      <div className="modal-header">
        <h2>{slot ? "Adicionar Horário" : "Novo Horário"}</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label htmlFor="inicio">Início</label>
          <input
            type="time"
            id="inicio"
            value={formData.inicio.format('HH:mm')}
            onChange={(e) => handleTimeChange('inicio', e.target.value)}
            step="900"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="fim">Fim</label>
          <input
            type="time"
            id="fim"
            value={formData.fim.format('HH:mm')}
            onChange={(e) => handleTimeChange('fim', e.target.value)}
            step="900"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tipo">Tipo</label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
          >
            <option value="disponivel">Disponível para consulta</option>
            <option value="bloqueado">Bloquear horário</option>
          </select>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <button 
            type="button" 
            className="cancel-button"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalDisponibilidade;