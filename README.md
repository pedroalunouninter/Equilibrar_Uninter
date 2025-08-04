# 🧠 Equilibrar - Sistema de Saúde Mental

Um sistema completo de gerenciamento de saúde mental que conecta pacientes e psicólogos, oferecendo acompanhamento personalizado e ferramentas de bem-estar.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Uso](#instalação-e-uso)
- [Credenciais de Demonstração](#credenciais-de-demonstração)
- [Funcionalidades por Perfil](#funcionalidades-por-perfil)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🎯 Sobre o Projeto

O **Equilibrar** é uma plataforma web desenvolvida para facilitar o acompanhamento de saúde mental, oferecendo uma interface intuitiva tanto para pacientes quanto para psicólogos. O sistema permite o registro de humor, acompanhamento de sessões, progresso terapêutico e recursos educacionais.

### 🎨 Design e UX

- **Interface Moderna**: Design responsivo com gradientes e animações suaves
- **Navegação Intuitiva**: Menu lateral com navegação por atalhos de teclado
- **Feedback Visual**: Animações e transições para melhor experiência do usuário
- **Acessibilidade**: Suporte a navegação por teclado e contrastes adequados

## ✨ Funcionalidades

### 🔐 Sistema de Autenticação
- Login seguro com validação de credenciais
- Diferentes perfis de acesso (Paciente/Psicólogo)
- Sessões persistentes com localStorage

### 👤 Perfil do Paciente
- **Dashboard Personalizado**: Visão geral do progresso e atividades recentes
- **Registro de Humor**: Sistema de avaliação diária com escala e notas
- **Histórico de Sessões**: Acompanhamento de sessões passadas e futuras
- **Progresso Terapêutico**: Gráficos e métricas de evolução
- **Recursos Educacionais**: Materiais de apoio e ferramentas de autoajuda
- **Perfil Completo**: Informações pessoais e configurações

### 👨‍⚕️ Perfil do Psicólogo
- **Dashboard Profissional**: Visão geral de pacientes e sessões
- **Gerenciamento de Pacientes**: Lista completa com status e informações
- **Controle de Sessões**: Agendamento e acompanhamento de sessões
- **Recursos Profissionais**: Materiais e ferramentas para prática clínica
- **Configurações Avançadas**: Personalização de horários e notificações

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Estilos modernos com Flexbox, Grid e animações
- **JavaScript ES6+**: Lógica de aplicação e interações
- **Font Awesome**: Ícones profissionais
- **Google Fonts**: Tipografia Inter para melhor legibilidade

### Recursos
- **LocalStorage**: Persistência de dados no navegador
- **CSS Variables**: Sistema de design tokens
- **Responsive Design**: Adaptação para diferentes dispositivos
- **Progressive Enhancement**: Funcionalidade básica sempre disponível

## 📁 Estrutura do Projeto

```
Equilibrar/
├── 📄 login.html              # Página de autenticação
├── 📄 paciente.html           # Interface do paciente
├── 📄 psicologo.html         # Interface do psicólogo
├── 📁 css/
│   └── 📄 style.css          # Estilos principais
├── 📁 js/
│   ├── 📄 script.js          # Scripts globais
│   ├── 📄 login.js           # Lógica de autenticação
│   ├── 📄 paciente.js        # Funcionalidades do paciente
│   └── 📄 psicologo.js       # Funcionalidades do psicólogo
├── 📁 img/
│   ├── 📄 logoEquilibrar.png     # Logo principal
│   └── 📄 logoEquilibrar2.png    # Logo alternativo
└── 📄 README.md              # Este arquivo
```

## 🚀 Instalação e Uso

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, mas recomendado)

### Instalação

1. **Clone ou baixe o projeto**
   ```bash
   git clone [url-do-repositorio]
   cd Equilibrar
   ```

2. **Abra o projeto**
   - Para desenvolvimento local: Use um servidor web local
   - Para teste rápido: Abra `login.html` diretamente no navegador

3. **Acesse a aplicação**
   - Abra `login.html` no seu navegador
   - Use as credenciais de demonstração abaixo

### 🎯 Como Usar

1. **Acesse a página de login** (`login.html`)
2. **Faça login** com as credenciais de demonstração
3. **Navegue pelas funcionalidades** usando o menu lateral
4. **Use atalhos de teclado** para navegação rápida:
   - `Ctrl + 1-6`: Navegar entre seções
   - `Esc`: Fechar modais/dropdowns

## 🔑 Credenciais de Demonstração

### 👤 Paciente
- **Usuário**: `paciente`
- **Senha**: `123456`

### 👨‍⚕️ Psicólogo
- **Usuário**: `psicologo`
- **Senha**: `123456`

## 📊 Funcionalidades por Perfil

### 👤 Paciente

#### Dashboard
- Visão geral do progresso
- Cards com métricas importantes
- Atividades recentes
- Próximas sessões

#### Registrar Humor
- Avaliação diária com escala 1-10
- Seleção de emoções
- Campo para observações
- Histórico visual

#### Minhas Sessões
- Próxima sessão agendada
- Histórico completo
- Status das sessões
- Ações disponíveis

#### Meu Progresso
- Gráficos de evolução
- Conquistas desbloqueadas
- Métricas de bem-estar
- Análise temporal

#### Recursos
- Materiais educacionais
- Ferramentas de autoajuda
- Exercícios práticos
- Links úteis

#### Meu Perfil
- Informações pessoais
- Dados de contato
- Preferências
- Histórico de uso

### 👨‍⚕️ Psicólogo

#### Dashboard
- Visão geral de pacientes
- Sessões do dia
- Atividades recentes
- Métricas profissionais

#### Pacientes
- Lista completa de pacientes
- Status de cada paciente
- Informações de contato
- Ações rápidas

#### Sessões
- Próximas sessões
- Histórico completo
- Gerenciamento de agenda
- Status e notas

#### Recursos
- Materiais profissionais
- Ferramentas clínicas
- Protocolos terapêuticos
- Bibliografia

#### Configurações
- Horários de atendimento
- Notificações
- Preferências de tema
- Configurações de conta

## 🎨 Características de Design

### Paleta de Cores
- **Primária**: Azul (#3b82f6)
- **Secundária**: Slate (#64748b)
- **Sucesso**: Verde (#10b981)
- **Aviso**: Amarelo (#f59e0b)
- **Erro**: Vermelho (#ef4444)

### Tipografia
- **Família**: Inter (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700
- **Hierarquia**: Títulos, subtítulos, corpo, legendas

### Componentes
- **Cards**: Com sombras e hover effects
- **Botões**: Gradientes e animações
- **Formulários**: Validação visual
- **Navegação**: Menu lateral responsivo

## 🔧 Funcionalidades Técnicas

### Persistência de Dados
- Dados salvos no localStorage
- Sessões persistentes
- Configurações personalizadas
- Histórico de atividades

### Responsividade
- Design mobile-first
- Breakpoints: 480px, 768px, 1024px
- Navegação adaptativa
- Componentes flexíveis

### Performance
- CSS otimizado
- JavaScript modular
- Carregamento lazy
- Animações suaves

### Acessibilidade
- Navegação por teclado
- Contraste adequado
- Labels semânticos
- ARIA attributes

## 🤝 Contribuição

### Como Contribuir

1. **Fork o projeto**
2. **Crie uma branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit suas mudanças** (`git commit -m 'Add some AmazingFeature'`)
4. **Push para a branch** (`git push origin feature/AmazingFeature`)
5. **Abra um Pull Request**

### Padrões de Código

- **HTML**: Semântico e acessível
- **CSS**: BEM methodology
- **JavaScript**: ES6+ features
- **Comentários**: Em português, claros e objetivos

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
