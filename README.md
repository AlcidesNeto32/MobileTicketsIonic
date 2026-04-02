# 🏥 Controle de Atendimento — Laboratório Médico

> Sistema mobile de gerenciamento de filas para laboratórios médicos, desenvolvido com **Ionic + Angular + Capacitor**. Simula o fluxo completo de atendimento: emissão de senhas, chamada por prioridade, painel de chamados e relatórios — tudo em memória, sem banco de dados.

<br>

---

## 📸 Screenshots

| Painel de Fichas | Totem (Cliente) |
|:---:|:---:|
| ![Painel de Fichas](./printsTela/painel.png) | ![Totem](./printsTela/totemSenhas.png) |
| **Guichê (Atendente)** | **Relatórios** |
| ![Guichê](./printsTela/guiche.png) | ![Relatório](./printsTela/relatorio.png) |

<br>

---

## 🧩 Funcionalidades

- 🎫 **Totem de emissão** — Cliente escolhe o tipo de senha (SP, SE ou SG) e recebe o código no formato `YYMMDD-PPSQ`
- 📋 **Painel de chamados** — Exibe as últimas 5 senhas chamadas em tempo real, com tipo e guichê
- 🖥️ **Guichê do atendente** — Chama a próxima senha respeitando a ordem de prioridade e finaliza o atendimento
- 📊 **Relatórios** — Relatório diário e mensal com totais, por prioridade e tempo médio de atendimento (TM)
- ⏰ **Controle de expediente** — Atendimento liberado apenas das 07h às 17h; senhas restantes são descartadas
- 🎲 **TM aleatório por tipo** — Tempo de atendimento varia conforme as regras de cada tipo de senha

<br>

---

## 🗂️ Abas da Aplicação

| Tab | Rota | Agente | Descrição |
|-----|------|--------|-----------|
| 📋 Painel | `/painel` | Público | Exibe as últimas 5 senhas chamadas |
| 🎫 Totem | `/totem` | AC — Cliente | Emite senha escolhendo o tipo |
| 🖥️ Guichê | `/guiche` | AA — Atendente | Chama e finaliza atendimentos |
| 📊 Relatório | `/relatorio` | Gestão | Totais diários e mensais |

<br>

---

## ⚙️ Regras de Negócio

### Tipos de senha e prioridade

| Tipo | Descrição | TM Base | Variação | Prioridade |
|------|-----------|---------|----------|------------|
| **SP** | Senha Prioritária | 15 min | ± 5 min | 🔴 Máxima |
| **SE** | Retirada de Exames | < 1 min (95%) / 5 min (5%) | — | 🟡 Intermediária |
| **SG** | Senha Geral | 5 min | ± 3 min | 🟢 Menor |

### Ordem de chamada

```
[SP] → [SE | SG] → [SP] → [SE | SG] → ...
```

Independente da quantidade de SG na fila, a ordem sempre respeita: **SP primeiro**, depois **SE** (se houver), depois **SG**.

### Formato do código da senha

```
YYMMDD-PPSQ

Exemplo: 250401-SP001

  YY → Ano com 2 dígitos         (ex: 25)
  MM → Mês com 2 dígitos         (ex: 04)
  DD → Dia com 2 dígitos         (ex: 01)
  PP → Tipo da senha             (SP | SE | SG)
  SQ → Sequência diária por tipo (reinicia todo dia)
```

### Outras regras

- **5%** das senhas emitidas são descartadas sem atendimento (responsabilidade do cliente)
- O painel exibe **apenas as 5 últimas** senhas chamadas — a próxima nunca é exibida
- Qualquer guichê pode atender qualquer tipo de senha
- Senhas não atendidas ao encerrar o expediente são descartadas

<br>

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| [Ionic Framework](https://ionicframework.com/) | 7.x | UI mobile + template tabs |
| [Angular](https://angular.io/) | 17.x | Framework base + roteamento |
| [Capacitor](https://capacitorjs.com/) | 5.x | Build nativo Android / iOS |
| TypeScript | 5.x | Tipagem e interfaces |
| RxJS | 7.x | Estado reativo com BehaviorSubject |


<br>

---

## 🏗️ Arquitetura

```
src/app/
├── tabs/                        ← Componente raiz com ion-tab-bar
│   ├── tabs.page.html
│   ├── tabs.page.ts
│   └── tabs-routing.module.ts
│
├── painel/                      ← Tab 1: Painel público de chamados
├── totem/                       ← Tab 2: Emissão de senhas (cliente)
├── guiche/                      ← Tab 3: Interface do atendente
├── relatorio/                   ← Tab 4: Relatórios gerenciais
│
└── services/
    ├── fila.service.ts          ← Responável pelas senhas e pelo gerenciamento delas
```

<br>

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js LTS
- Ionic CLI: `npm install -g @ionic/cli`
- Angular CLI: `npm install -g @angular/cli`

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/controle-atendimento.git
cd controle-atendimento

# Instalar dependências
npm install

# Rodar no navegador
ionic serve
```

<br>

---

## 📁 Scripts disponíveis

```bash
npm start          # Inicia o servidor de desenvolvimento
ionic serve        # Equivalente com live reload
ionic build        # Gera o build de produção em /www
npx cap sync       # Sincroniza o build com o projeto nativo
```

<br>

---

## 👥 Agentes do Sistema

| Agente | Sigla | Papel |
|--------|-------|-------|
| Agente Sistema | AS | Emite senhas e responde aos comandos da atendente |
| Agente Atendente | AA | Aciona o sistema para chamar o próximo e efetua o atendimento no guichê |
| Agente Cliente | AC | Aciona o totem, emite a senha e aguarda ser chamado no painel |

<br>

---
