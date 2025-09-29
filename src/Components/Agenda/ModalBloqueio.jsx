import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import moment from 'moment';
import './ModalBloqueio.css';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    border: '1px solid #ccc'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  }
};

const ModalBloqueio = ({
  visible,
  onClose,
  onRemover,
  onSalvarBloqueio, // Nova prop para salvar bloqueios
  loading,
  slot // O slot selecionado no calendário
}) => {
  const [formData, setFormData] = useState({
    inicio: slot ? moment(slot.start).startOf('hour') : moment().startOf('hour'),
    fim: slot ? moment(slot.end).startOf('hour') : moment().startOf('hour').add(1, 'hour'),
    recorrente: false,
    dias_recorrencia: []
  });

  // Reseta o formulário quando o modal é aberto ou o slot muda
  useEffect(() => {
    if (slot) {
      setFormData({
        inicio: moment(slot.start).startOf('hour'),
        fim: moment(slot.end).startOf('hour'),
        recorrente: false,
        dias_recorrencia: []
      });
    }
  }, [slot]);

  const handleTimeChange = (field, timeString) => {
    // 1. Converte a string de hora para um objeto moment temporário
    const [hours, minutes] = timeString.split(':');
    
    // 2. Clone a data original (garantindo que o dia seja mantido)
    let newMoment = formData[field].clone();

    // 3. Aplica a nova hora e minuto
    newMoment.hour(parseInt(hours, 10))
             .minute(parseInt(minutes, 10))
             .second(0)
             .millisecond(0);

    setFormData(prev => ({ ...prev, [field]: newMoment }));
};

  const handleRecorrenciaChange = (e) => {
    setFormData(prev => ({ ...prev, recorrente: e.target.checked }));
  };

  const handleDiasRecorrenciaChange = (e) => {
    const { value, checked } = e.target;
    let dias = [...formData.dias_recorrencia];
    if (checked) {
      dias.push(value);
    } else {
      dias = dias.filter(dia => dia !== value);
    }
    setFormData(prev => ({ ...prev, dias_recorrencia: dias }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvarBloqueio({
      inicio: formData.inicio.toDate(),
      fim: formData.fim.toDate(),
      recorrente: formData.recorrente,
      dias_recorrencia: formData.dias_recorrencia
    });
  };

  return (
    <Modal
      isOpen={visible}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Gerenciar Bloqueio"
    >
      <div className="modal-header">
        <h2>{slot ? "Gerenciar Bloqueio" : "Novo Bloqueio"}</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <form onSubmit={handleSubmit} className="modal-form">
        {/* Input de Início e Fim: Usando step="3600" para horários inteiros */}
        <div className="form-group">
          <label htmlFor="inicio">Início</label>
          <input
            type="time"
            id="inicio"
            value={formData.inicio.format('HH:mm')}
            onChange={(e) => handleTimeChange('inicio', e.target.value)}
            step="3600" // 3600 segundos = 1 hora
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
            step="3600"
            required
          />
        </div>

        {/* Lógica de Recorrência */}
        <div className="form-group-checkbox">
          <label>
            Bloqueio Recorrente
            <input
              type="checkbox"
              checked={formData.recorrente}
              onChange={handleRecorrenciaChange}
            />

          </label>
        </div>

        {formData.recorrente && (
          <div className="form-group-dias">
            <p>Repetir em:</p>
            {['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'].map((dia, index) => (
              <label key={dia}>
                <input
                  type="checkbox"
                  value={index}
                  checked={formData.dias_recorrencia.includes(index.toString())}
                  onChange={handleDiasRecorrenciaChange}
                />
                {dia}
              </label>
            ))}
          </div>
        )}

        <div className="modal-footer">
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Bloqueio'}
          </button>
          {slot && (
            <button
              type="button"
              className="remover-button"
              onClick={onRemover}
              disabled={loading}
            >
              Remover
            </button>
          )}
          <button
            type="button"
            className="cancelar-button"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalBloqueio;