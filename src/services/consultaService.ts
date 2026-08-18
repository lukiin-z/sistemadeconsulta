import api from "./api";
import { StatusConsulta } from "../types/statusConsulta";
import { Consulta } from "../interfaces/consulta";

export type NovaConsulta = {
  medicoId: number;
  pacienteId: number;
  dataHora: string;
  valor: number;
  observacoes?: string;
};

export async function listarConsultas(): Promise<Consulta[]> {
  const response = await api.get<Consulta[]>("/consultas");
  return response.data;
}

export async function buscarConsultaPorId(id: number): Promise<Consulta> {
  const response = await api.get<Consulta>(`/consultas/${id}`);
  return response.data;
}

export async function agendarConsulta(
  novaConsulta: NovaConsulta
): Promise<Consulta> {
  const response = await api.post<Consulta>("/consultas", novaConsulta);
  return response.data;
}

export async function atualizarStatusConsulta(
  consultaId: number,
  status: StatusConsulta
): Promise<Consulta> {
  const response = await api.patch<Consulta>(`/consultas/${consultaId}/status`, {
    status,
  });
  return response.data;
}

export async function listarConsultasPorMedico(
  medicoId: number
): Promise<Consulta[]> {
  const response = await api.get<Consulta[]>(`/consultas/medico/${medicoId}`);
  return response.data;
}

export async function listarConsultasPorPaciente(
  pacienteId: number
): Promise<Consulta[]> {
  const response = await api.get<Consulta[]>(
    `/consultas/paciente/${pacienteId}`
  );
  return response.data;
}
