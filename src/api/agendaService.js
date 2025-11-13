import api from './apiConfig';

export const AgendaService = {
  async getDisponibilidades(profissionalId, start, end) {
    const response = await api.get('disponibilidade/', {
      params: { profissional_id: profissionalId, data_inicio: start, data_fim: end }
    });
    return response.data;
  },

  async createDisponibilidade(disponibilidade) {
    const response = await api.post('disponibilidade/', disponibilidade);
    return response.data;
  },

  async updateDisponibilidade(id, updates) {
    const response = await api.put(`disponibilidade/${id}`, updates);
    return response.data;
  },

  async deleteDisponibilidade(id) {
    await api.delete(`disponibilidade/${id}`);
  },

  async getBloqueios(profissionalId, start, end) {
    const response = await api.get('bloqueio/', {
      params: { profissional_id: profissionalId, data_inicio: start, data_fim: end }
    });
    return response.data;
  },

  async createBloqueio(bloqueio) {
    const response = await api.post('bloqueio/', bloqueio);
    return response.data;
  },

  async deleteBloqueio(id) {
    await api.delete(`bloqueio/${id}`);
  },

  async getAgendamentos(profissionalId, start, end) {
    const response = await api.get('agendamento/profissional', {
      params: { profissional_id: profissionalId, data_inicio: start, data_fim: end }
    });
    return response.data;
  },

  
  //carregarAgenda do profissional
  async getAgenda(profissionalId, start, end) {
    const response = await api.get(`/agendamento/agenda/${profissionalId}`, {
      params: { data_inicio: start, data_fim: end }
    });
    return response;
  },

  //Atualiza status do agendamento
  async updateAgendamentoStatus(agendamentoId, status, motivo) {
    const response = await api.patch(`agendamento/${agendamentoId}/status`, { status, motivo });
    return response.data;
  },

  async updateBloqueio(id, updates) {
    const response = await api.put(`bloqueio/${id}`, updates);
    return response.data;
  },

  async cancelarAgendamento(id){
    const response = await api.delete(`agendamento/cancelar/${id}`)
    return response.data.erro;
  },

  async urgenciaService(profissionalId){
    const response = await api.get(`urgencia/pendentes/${profissionalId}`);
    return response.data;
  },

  //decidir Urgencia
  async decidirUrgencia(solicitacaoId, acao, motivo) {
    const response = await api.post(`urgencia/aprovar/${solicitacaoId}`, {
      status: acao === 'aprovar' ? 'aprovada' : 'rejeitada',
      motivo: motivo || ''
    });
    return response.data;
  },

  //solicitar Urgencia
  async solicitarUrgencia(profissionalId, pacienteId, motivo, janelaDeTempo) {
    const response = await api.post('urgencia/solicitar', {
      profissionalId,
      pacienteId,
      motivo,
      janelaDeTempo: janelaDeTempo
    });
    return response.data;
  }

};