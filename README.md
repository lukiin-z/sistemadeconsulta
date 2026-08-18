# Sistema de consultas mobile

Aplicativo React Native com Expo para acompanhar médicos, pacientes e consultas de uma API REST. Permite carregar os cadastros, agendar consultas e alterar o status para confirmado ou cancelado.

O backend compatível está em [lukiin-z/backend-hete](https://github.com/lukiin-z/backend-hete).

## Tecnologias

- Expo 54;
- React Native 0.81;
- React 19;
- TypeScript em modo estrito;
- Axios.

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
- listagem detalhada de consultas;
- agendamento de consulta;
- confirmação e cancelamento;
- formatação de data e moeda para `pt-BR`;
- feedback de carregamento, erro e nova tentativa.

## Estrutura

```text
assets/                 ícones e imagens do Expo
src/
├── components/         componentes reutilizáveis
├── interfaces/         modelos principais do domínio
├── services/           cliente HTTP e integração REST
└── types/              tipos auxiliares do domínio
App.tsx                 tela principal
app.json                configuração do Expo
index.ts                ponto de entrada
```

## Integração

O app usa os endpoints `/medicos`, `/pacientes` e `/consultas`. Para agendar uma consulta, médico e paciente precisam estar cadastrados previamente no backend.
