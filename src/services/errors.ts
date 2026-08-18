import axios from "axios";

type ProblemDetail = {
  detail?: string;
  title?: string;
  errors?: Record<string, string>;
};

export function obterMensagemErro(error: unknown): string {
  if (!axios.isAxiosError<ProblemDetail>(error)) {
    return "Ocorreu um erro inesperado. Tente novamente.";
  }

  const data = error.response?.data;
  const fieldMessage = data?.errors && Object.values(data.errors)[0];
  return fieldMessage ?? data?.detail ?? data?.title ?? "Não foi possível acessar a API.";
}
