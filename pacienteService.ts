import api from "./api";
import { Paciente } from "../types/paciente";

export async function listarPacientes(): Promise<Paciente[]> {
 const response = await api.get<Paciente[]>("/pacientes");
 return response.data;
}

export async function buscarPacientePorId(id: number): Promise<Paciente> {
 const response = await api.get<Paciente>(`/pacientes/${id}`);
 return response.data;
}
