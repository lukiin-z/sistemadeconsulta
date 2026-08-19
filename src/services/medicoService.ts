import { Medico } from "../interfaces/medico";
import api from "./api";

export async function listarMedicos(): Promise<Medico[]> {
  const response = await api.get<Medico[]>("/medicos");
  return response.data;
}

export async function buscarMedicoPorId(id: number): Promise<Medico> {
  const response = await api.get<Medico>(`/medicos/${id}`);
  return response.data;
}

export async function buscarMedicoPorCrm(crm: string): Promise<Medico> {
  const response = await api.get<Medico>(`/medicos/crm/${encodeURIComponent(crm)}`);
  return response.data;
}

export async function listarMedicosPorEspecialidade(especialidadeId: number): Promise<Medico[]> {
  const response = await api.get<Medico[]>(`/medicos/especialidade/${especialidadeId}`);
  return response.data;
}

export async function cadastrarMedico(dados: Omit<Medico, "id">): Promise<Medico> {
  const response = await api.post<Medico>("/medicos", dados);
  return response.data;
}

export async function atualizarMedico(id: number, dados: Medico): Promise<Medico> {
  const response = await api.put<Medico>(`/medicos/${id}`, dados);
  return response.data;
}
