import { useCallback, useEffect, useMemo, useState } from "react";

import { Consulta } from "../interfaces/consulta";
import { Medico } from "../interfaces/medico";
import { Paciente } from "../types/paciente";
import { StatusConsulta } from "../types/statusConsulta";
import {
  agendarConsulta,
  atualizarStatusConsulta,
  listarConsultas,
  NovaConsulta,
} from "../services/consultaService";
import { listarMedicos } from "../services/medicoService";
import { listarPacientes } from "../services/pacienteService";
import { obterMensagemErro } from "../services/errors";

export type Feedback = { tipo: "sucesso" | "erro"; mensagem: string };

const ordenarConsultas = (items: Consulta[]) =>
  [...items].sort((a, b) => a.dataHora.localeCompare(b.dataHora));

export function useAgenda() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizandoId, setAtualizandoId] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const carregar = useCallback(async () => {
    try {
      setErro(null);
      const [listaMedicos, listaPacientes, listaConsultas] = await Promise.all([
        listarMedicos(),
        listarPacientes(),
        listarConsultas(),
      ]);
      setMedicos(listaMedicos);
      setPacientes(listaPacientes);
      setConsultas(ordenarConsultas(listaConsultas));
    } catch (error) {
      setErro(obterMensagemErro(error));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const agendar = useCallback(async (novaConsulta: NovaConsulta) => {
    try {
      const criada = await agendarConsulta(novaConsulta);
      setConsultas((current) => ordenarConsultas([...current, criada]));
      setFeedback({ tipo: "sucesso", mensagem: "Consulta agendada com sucesso." });
    } catch (error) {
      const mensagem = obterMensagemErro(error);
      setFeedback({ tipo: "erro", mensagem });
      throw new Error(mensagem);
    }
  }, []);

  const alterarStatus = useCallback(async (id: number, status: StatusConsulta) => {
    try {
      setAtualizandoId(id);
      const atualizada = await atualizarStatusConsulta(id, status);
      setConsultas((current) =>
        current.map((consulta) => (consulta.id === id ? atualizada : consulta))
      );
      setFeedback({
        tipo: "sucesso",
        mensagem: `Consulta marcada como ${status}.`,
      });
    } catch (error) {
      setFeedback({ tipo: "erro", mensagem: obterMensagemErro(error) });
    } finally {
      setAtualizandoId(null);
    }
  }, []);

  const totais = useMemo(
    () => ({
      agendadas: consultas.filter((item) => item.status === "agendada").length,
      confirmadas: consultas.filter((item) => item.status === "confirmada").length,
      concluidas: consultas.filter((item) => item.status === "realizada").length,
    }),
    [consultas]
  );

  return {
    medicos,
    pacientes,
    consultas,
    carregando,
    atualizandoId,
    erro,
    feedback,
    totais,
    carregar,
    agendar,
    alterarStatus,
    limparFeedback: () => setFeedback(null),
  };
}
