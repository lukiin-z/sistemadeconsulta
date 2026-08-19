export type RootStackParamList = {
  Home: undefined;
  Agenda: undefined;
  LoginPaciente: undefined;
  CadastroPaciente: undefined;
  MinhasConsultas: { pacienteId: number; pacienteNome: string };
  EscolhaEspecialidade: { pacienteId: number; pacienteNome: string };
  EscolhaMedico: {
    pacienteId: number;
    pacienteNome: string;
    especialidadeId: number;
    especialidadeNome: string;
  };
  AgendarConsulta: {
    pacienteId: number;
    pacienteNome: string;
    medicoId: number;
    medicoNome: string;
    medicoValor: number | null;
  };
  LoginMedico: undefined;
  CadastroMedico: undefined;
  PerfilMedico: { medicoId: number; medicoNome: string };
  ConsultasMedico: { medicoId: number; medicoNome: string };
};
