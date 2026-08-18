# Sistema de consultas mobile

Aplicativo React Native com Expo para organizar uma agenda de consultas médicas. O painel reúne indicadores, filtros, agendamento guiado e o fluxo completo de atendimento em uma interface responsiva.

O backend compatível está em [lukiin-z/backend-hete](https://github.com/lukiin-z/backend-hete).

## Tecnologias

- Expo 54;
- React Native 0.81;
- React 19;
- TypeScript em modo estrito;
- Axios;
- DateTimePicker nativo;
- Picker para seleção de médico e paciente.

## Requisitos

- Node.js 20 ou superior;
- npm;
- backend executando e acessível pelo dispositivo ou emulador.

## Executando

```bash
git clone https://github.com/lukiin-z/sistemadeconsulta.git
cd sistemadeconsulta
npm ci
```

Copie o arquivo de ambiente e ajuste o endereço da API quando necessário:

```bash
cp .env.example .env.local
npm start
```

No PowerShell, use `Copy-Item .env.example .env.local`.

### Endereço da API

A variável `EXPO_PUBLIC_API_URL` tem valor padrão `http://localhost:8080`.

- navegador local: `http://localhost:8080`;
- emulador Android: normalmente `http://10.0.2.2:8080`;
- celular físico: use o IP local do computador, por exemplo `http://192.168.0.10:8080`.

Se usar outro endereço, inclua a origem do Expo na configuração `CORS_ALLOWED_ORIGINS` do backend.

## Comandos

| Comando | Descrição |
| --- | --- |
| `npm start` | Abre o servidor de desenvolvimento do Expo |
| `npm run android` | Inicia no Android |
| `npm run ios` | Inicia no iOS |
| `npm run web` | Inicia no navegador |
| `npm run typecheck` | Valida os tipos sem gerar arquivos |

## Funcionalidades

- listagem de médicos e pacientes;
- painel com indicadores por status;
- filtros horizontais de agenda;
- cards responsivos com médico, especialidade, paciente, data e valor;
- agendamento com seletores, data e horário guiados;
- confirmação, realização e cancelamento conforme o fluxo da API;
- formatação de data e moeda para `pt-BR`;
- estados de carregamento e vazio;
- feedback claro de sucesso, erro e nova tentativa.

## Estrutura

```text
assets/                 ícones e imagens do Expo
src/
├── components/         componentes reutilizáveis
├── hooks/              estado e ações da agenda
├── interfaces/         modelos principais do domínio
├── services/           cliente HTTP e integração REST
├── types/              tipos auxiliares do domínio
└── utils/              data, horário e formatação
App.tsx                 tela principal
app.json                configuração do Expo
index.ts                ponto de entrada
```

## Integração

O app usa `/medicos`, `/pacientes`, `/consultas` e `/consultas/{id}/status`. Para agendar, médico e paciente precisam existir e estar ativos. A API também rejeita choque de horário e transições de status inválidas, e o app exibe essas mensagens ao usuário.
