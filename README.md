# 🏥 Sistema de Consultas Mobile

## 📋 Sobre o Projeto

O **Sistema de Consultas Mobile** é uma aplicação mobile desenvolvida com **React Native** e **Expo** para o gerenciamento de consultas médicas. O aplicativo permite visualizar informações detalhadas de consultas, incluindo dados do médico, paciente, especialidade, valor e status, além de possibilitar a confirmação ou cancelamento de consultas de forma interativa.

O projeto utiliza **TypeScript** com tipagem estrita para garantir maior segurança e manutenibilidade do código, aplicando conceitos de `types` e `interfaces` para modelar as entidades do domínio.

---

## 🚀 Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|:---:|:---:|---|
| ⚛️ **React Native** | `0.81.5` | Framework para desenvolvimento de aplicações mobile nativas |
| 📱 **Expo** | `~54.0.33` | Plataforma e conjunto de ferramentas para desenvolvimento React Native |
| 🔷 **TypeScript** | `~5.9.2` | Superset tipado de JavaScript para maior segurança no código |
| ⚛️ **React** | `19.1.0` | Biblioteca para construção de interfaces de usuário |
| 🌐 **React Native Web** | `^0.21.0` | Suporte para execução da aplicação em navegadores web |
| 📊 **Expo Status Bar** | `~3.0.9` | Componente para controle da barra de status do dispositivo |

---

## 📁 Estrutura do Projeto

```
📦 sistema-consultas-mobile/
├── 🖼️ assets/                          # Recursos visuais (ícones, splash screen)
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
├── 📂 src/
│   ├── 🧩 components/                  # Componentes reutilizáveis
│   │   ├── ConsultaCard.tsx            # Card de exibição de consulta
│   │   └── index.ts                    # Barrel export dos componentes
│   ├── 📄 interface/                    # Interfaces TypeScript
│   │   ├── consulta.ts                 # Interface Consulta
│   │   └── medico.ts                   # Interface Medico
│   └── 🏷️ types/                       # Types TypeScript
│       ├── especialidade.ts            # Type Especialidade
│       ├── paciente.ts                 # Type Paciente
│       └── statusConsulta.ts           # Type StatusConsulta
├── 🏠 App.tsx                           # Componente raiz da aplicação
├── 🚪 index.ts                          # Ponto de entrada (registerRootComponent)
├── ⚙️ app.json                          # Configurações do Expo
├── 🔧 tsconfig.json                     # Configurações do TypeScript
├── 📦 package.json                      # Dependências e scripts do projeto
└── 🔒 package-lock.json                 # Lock file das dependências
```

---

## ✨ Funcionalidades Implementadas

- 🩺 **Visualização de Consulta** — Exibição completa dos dados da consulta em um card estilizado, incluindo informações do médico (nome, CRM, especialidade), do paciente (nome, CPF, e-mail, telefone) e detalhes da consulta (data, valor, observações)
- 🔄 **Gerenciamento de Status** — Sistema de status com quatro estados possíveis: `agendada`, `confirmada`, `cancelada` e `realizada`, com indicação visual por cores (🟠 laranja, 🟢 verde, 🔴 vermelho)
- ✅ **Confirmar Consulta** — Botão para confirmar uma consulta agendada, alterando o status para `confirmada` com feedback visual em verde
- ❌ **Cancelar Consulta** — Botão para cancelar uma consulta agendada, alterando o status para `cancelada` com feedback visual em vermelho
- 💰 **Formatação de Dados** — Formatação automática de valores monetários em Real (BRL) e datas no padrão brasileiro (dd/mm/aaaa)
- 📱 **Interface Responsiva** — Layout adaptável com ScrollView e componentes estilizados utilizando StyleSheet do React Native
- 🔷 **Tipagem Estrita** — Modelagem completa do domínio com `types` e `interfaces` TypeScript, garantindo segurança em tempo de desenvolvimento

---

## 🔗 Endpoints Principais

> 💡 O projeto atualmente opera com dados locais (mock data) definidos diretamente no componente `App.tsx`. As entidades do domínio estão modeladas e preparadas para integração com uma API REST futura.

### 🗂️ Entidades do Domínio

| Entidade | Tipo | Campos Principais |
|:---:|:---:|---|
| 🏷️ `Especialidade` | `type` | `id`, `nome`, `descricao?` |
| 👤 `Paciente` | `type` | `id`, `nome`, `cpf`, `email`, `telefone?` |
| 👨‍⚕️ `Medico` | `interface` | `id`, `nome`, `crm`, `especialidade`, `ativo` |
| 📋 `Consulta` | `interface` | `id`, `medico`, `paciente`, `data`, `valor`, `status`, `observacoes?` |
| 🔖 `StatusConsulta` | `type` | `"agendada"` \| `"confirmada"` \| `"cancelada"` \| `"realizada"` |

### 🌐 Sugestão de Endpoints para Integração Futura

| Método | Rota | Descrição |
|:---:|---|---|
| 🟢 `GET` | `/consultas` | Listar todas as consultas |
| 🟢 `GET` | `/consultas/:id` | Buscar consulta por ID |
| 🟡 `POST` | `/consultas` | Criar nova consulta |
| 🔵 `PUT` | `/consultas/:id` | Atualizar dados da consulta |
| 🟣 `PATCH` | `/consultas/:id/status` | Alterar status da consulta |
| 🟢 `GET` | `/medicos` | Listar todos os médicos |
| 🟢 `GET` | `/pacientes` | Listar todos os pacientes |
| 🟢 `GET` | `/especialidades` | Listar todas as especialidades |

---

## 🛠️ Como Executar

### 📋 Pré-requisitos

- 📦 [Node.js](https://nodejs.org/) (versão 18 ou superior)
- 📦 [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- 🛠️ [Expo CLI](https://docs.expo.dev/get-started/installation/)
- 📱 [Expo Go](https://expo.dev/client) instalado no dispositivo móvel (para testes no celular)

### 🚀 Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/An4lu/sistema-consultas-mobile.git
   cd sistema-consultas-mobile
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npm start
   ```

4. **Execute no dispositivo desejado**
   - 🤖 **Android:** Pressione `a` no terminal ou execute `npm run android`
   - 🍎 **iOS:** Pressione `i` no terminal ou execute `npm run ios`
   - 🌐 **Web:** Pressione `w` no terminal ou execute `npm run web`
   - 📱 **Expo Go:** Escaneie o QR Code exibido no terminal com o aplicativo Expo Go

---

> 💜 Desenvolvido com React Native + Expo + TypeScript
