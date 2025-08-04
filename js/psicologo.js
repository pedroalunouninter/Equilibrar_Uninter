// Variáveis globais
let pacientes = [];
let sessoes = [];
let notas = [];
let perfil = {};
let configuracoes = {};
let usuarioAtual = null;
let mesAtual = new Date();
let notificacoes = [];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar classe de carregamento
    document.body.classList.add('loading');
    
    // Sequência de inicialização silenciosa
    setTimeout(() => {
    carregarUsuarioAtual();
    }, 100);
    
    setTimeout(() => {
    carregarDados();
    }, 300);
    
    setTimeout(() => {
    inicializarEventos();
    inicializarSidebar();
    }, 500);
    
    setTimeout(() => {
        carregarDadosIniciais();
        carregarDadosExemplo();
        atualizarDashboardReal();
    }, 700);
    
    setTimeout(() => {
    inicializarSistemaNotificacoes();
        inicializarPageIndicator();
        document.body.classList.remove('loading');
        
        // Garantir que o dashboard seja exibido por padrão
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            navegarParaComTransicao(hash);
        } else {
            navegarParaComTransicao('dashboard');
        }
    }, 900);
    
    // Backup automático
    const ultimoBackup = localStorage.getItem('equilibrar_ultimo_backup_psico');
    const agora = new Date().getTime();
    const umDia = 24 * 60 * 60 * 1000;
    
    if (!ultimoBackup || (agora - parseInt(ultimoBackup)) > umDia) {
        criarBackupAutomatico();
        localStorage.setItem('equilibrar_ultimo_backup_psico', agora.toString());
    }
    
    // Adicionar listener para mudanças de hash
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            navegarParaComTransicao(hash);
        }
    });
    
    // Adicionar listener para teclas de atalho
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + número para navegação rápida
        if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            const sectionMap = {
                '1': 'dashboard',
                '2': 'pacientes',
                '3': 'sessoes',
                '4': 'recursos',
                '5': 'configuracoes'
            };
            const sectionId = sectionMap[e.key];
            if (sectionId) {
                navegarParaComTransicao(sectionId);
            }
        }
    });
});

// Sistema de Notificações Simplificado
function inicializarSistemaNotificacoes() {
    // Sistema de notificações removido para simplificar a interface
    localStorage.removeItem('equilibrar_notificacoes_psico');
}

// Carregar usuário atual do localStorage
function carregarUsuarioAtual() {
    const usuarioSalvo = localStorage.getItem('equilibrar_usuario_atual');
    if (usuarioSalvo) {
        usuarioAtual = JSON.parse(usuarioSalvo);
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = usuarioAtual.nome || 'Dr. Silva';
        }
    } else {
        // Criar usuário padrão se não houver usuário
        usuarioAtual = {
            id: 1,
            nome: 'Dr. Silva',
            email: 'dr.silva@equilibrar.com',
            tipo: 'psicologo',
            especialidade: 'Psicologia Clínica'
        };
        localStorage.setItem('equilibrar_usuario_atual', JSON.stringify(usuarioAtual));
        
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = usuarioAtual.nome;
        }
    }
}

// Inicializar sidebar com funcionalidades melhoradas
function inicializarSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle da sidebar
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
    
    // Fechar sidebar ao clicar fora (em dispositivos móveis)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
    
    // Navegação ativa com animações e sincronização melhorada
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const sectionId = this.getAttribute('data-section');
            
            // Adicionar efeito de loading
            this.classList.add('loading');
            
            // Navegar para a seção com transição suave
            navegarParaComTransicao(sectionId);
            
            // Remover efeito de loading após a transição
            setTimeout(() => {
                this.classList.remove('loading');
            }, 300);
        });
    });
    
    // Verificar URL atual e definir seção ativa
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        navegarParaComTransicao(hash);
    } else {
        // Definir dashboard como padrão
        navegarParaComTransicao('dashboard');
    }
    
    // Atualizar navegação ativa baseada no scroll
    window.addEventListener('scroll', debounce(function() {
        atualizarNavegacaoAtiva();
    }, 100));
}

// Função de navegação com transições suaves
function navegarParaComTransicao(sectionId) {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    const targetSection = document.getElementById(sectionId);
    const pageIndicator = document.getElementById('page-indicator');
    const sidebar = document.getElementById('sidebar');
    
    if (!targetSection) return;
    
    // Adicionar classe de transição
    document.body.classList.add('navigating');
    
    // Ativar indicador de página
    if (pageIndicator) {
        pageIndicator.classList.add('active');
    }
    
    // Adicionar classe ativa ao sidebar
    if (sidebar) {
        sidebar.classList.add('has-active');
    }
    
    // Esconder todas as seções exceto a atual
    sections.forEach(section => {
        if (section.id !== sectionId) {
            section.classList.remove('active');
            section.style.display = 'none';
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
        }
    });
    
    // Mostrar seção selecionada com animação suave
    targetSection.classList.add('active');
    targetSection.style.display = 'block';
    
    // Pequeno delay para garantir que o display block foi aplicado
    requestAnimationFrame(() => {
        targetSection.style.opacity = '1';
        targetSection.style.transform = 'translateY(0)';
    });
    
    // Scroll suave para o topo da seção
    setTimeout(() => {
        targetSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 100);
    
    // Atualizar navegação ativa
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
            
            // Adicionar efeito de destaque
            link.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                link.style.animation = '';
            }, 500);
        }
    });
    
    // Atualizar URL
    history.pushState(null, null, `#${sectionId}`);
    
    // Atualizar título da página
    atualizarTituloPagina(sectionId);
    
    // Melhorar feedback visual
    melhorarFeedbackNavegacao(sectionId);

    // Adicionar efeito de entrada para elementos da seção
    const elementosAnimados = targetSection.querySelectorAll('.card, .action-card, .activity-item');
    elementosAnimados.forEach((elemento, index) => {
        elemento.style.opacity = '0';
        elemento.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            elemento.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            elemento.style.opacity = '1';
            elemento.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });

    // Remover classe de transição
    setTimeout(() => {
        document.body.classList.remove('navigating');
    }, 400);

    // Carregar dados específicos da seção
    carregarDadosSecao(sectionId);
}

// Carregar dados específicos de cada seção
function carregarDadosSecao(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            atualizarDashboardReal();
            atualizarProximaSessao();
            break;
        case 'pacientes':
            carregarPacientes();
            break;
        case 'sessoes':
            carregarSessoes();
            break;
        case 'recursos':
            // Carregar recursos se necessário
            break;
        case 'configuracoes':
            carregarConfiguracoesSalvas();
            break;
    }
}

// Função debounce para otimizar performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Carregar dados do localStorage
function carregarDados() {
    const dadosSalvos = localStorage.getItem('equilibrar_dados_psicologo');
    if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        pacientes = dados.pacientes || [];
        sessoes = dados.sessoes || [];
        notas = dados.notas || [];
        perfil = dados.perfil || {};
        configuracoes = dados.configuracoes || {};
    }
    
    // Carregar dados mockados se não houver dados salvos
    if (pacientes.length === 0) {
        carregarDadosMockados();
    }
}

// Carregar dados mockados mais realistas
function carregarDadosMockados() {
    pacientes = [
        {
            id: 1,
            nome: 'Maria Silva',
            email: 'maria.silva@email.com',
            telefone: '(11) 91234-5678',
            idade: 28,
            motivo: 'Ansiedade e estresse no trabalho',
            dataCadastro: '2024-01-15',
            status: 'ativo',
            proximaSessao: '2024-06-10T14:00:00',
            humorAtual: 'feliz',
            humorValor: 7,
            ultimoRegistro: '2024-06-15T08:30:00'
        },
        {
            id: 2,
            nome: 'João Santos',
            email: 'joao.santos@email.com',
            telefone: '(11) 93456-7890',
            idade: 35,
            motivo: 'Depressão e baixa autoestima',
            dataCadastro: '2024-02-20',
            status: 'ativo',
            proximaSessao: '2024-06-12T16:00:00',
            humorAtual: 'neutro',
            humorValor: 5,
            ultimoRegistro: '2024-06-14T19:45:00'
        },
        {
            id: 3,
            nome: 'Ana Costa',
            email: 'ana.costa@email.com',
            telefone: '(11) 94567-8901',
            idade: 42,
            motivo: 'Problemas de relacionamento',
            dataCadastro: '2024-03-10',
            status: 'alerta',
            proximaSessao: '2024-06-15T10:00:00',
            humorAtual: 'ansioso',
            humorValor: 8,
            ultimoRegistro: '2024-06-13T09:15:00'
        },
        {
            id: 4,
            nome: 'Pedro Oliveira',
            email: 'pedro.oliveira@email.com',
            telefone: '(11) 95678-9012',
            idade: 29,
            motivo: 'Dificuldades de concentração',
            dataCadastro: '2024-04-05',
            status: 'ativo',
            proximaSessao: '2024-06-22T15:30:00',
            humorAtual: 'calmo',
            humorValor: 8,
            ultimoRegistro: '2024-06-12T20:30:00'
        },
        {
            id: 5,
            nome: 'Lucia Ferreira',
            email: 'lucia.ferreira@email.com',
            telefone: '(11) 96789-0123',
            idade: 38,
            motivo: 'Insônia e ansiedade',
            dataCadastro: '2024-05-12',
            status: 'inativo',
            proximaSessao: null,
            humorAtual: null,
            humorValor: null,
            ultimoRegistro: '2024-06-05T14:20:00'
        },
        {
            id: 6,
            nome: 'Carlos Mendes',
            email: 'carlos.mendes@email.com',
            telefone: '(11) 97890-1234',
            idade: 31,
            motivo: 'Estresse pós-traumático',
            dataCadastro: '2024-06-01',
            status: 'ativo',
            proximaSessao: '2024-06-21T11:00:00',
            humorAtual: 'triste',
            humorValor: 3,
            ultimoRegistro: '2024-06-11T10:00:00'
        }
    ];

    sessoes = [
        {
            id: 1,
            pacienteId: 1,
            pacienteNome: 'Maria Silva',
            data: '2024-06-10',
            hora: '14:00',
            duracao: 50,
            tipo: 'online',
            status: 'agendada',
            observacoes: 'Primeira sessão de avaliação'
        },
        {
            id: 2,
            pacienteId: 2,
            pacienteNome: 'João Santos',
            data: '2024-06-12',
            hora: '16:00',
            duracao: 50,
            tipo: 'presencial',
            status: 'agendada',
            observacoes: 'Continuidade do tratamento'
        },
        {
            id: 3,
            pacienteId: 3,
            pacienteNome: 'Ana Costa',
            data: '2024-06-15',
            hora: '10:00',
            duracao: 50,
            tipo: 'online',
            status: 'agendada',
            observacoes: 'Sessão de terapia de casal'
        },
        {
            id: 4,
            pacienteId: 4,
            pacienteNome: 'Pedro Oliveira',
            data: '2024-06-22',
            hora: '15:30',
            duracao: 50,
            tipo: 'presencial',
            status: 'agendada',
            observacoes: 'Acompanhamento semanal'
        },
        {
            id: 5,
            pacienteId: 6,
            pacienteNome: 'Carlos Mendes',
            data: '2024-06-21',
            hora: '11:00',
            duracao: 60,
            tipo: 'online',
            status: 'agendada',
            observacoes: 'Sessão de EMDR'
        }
    ];

    notas = [
        {
            id: 1,
            pacienteId: 1,
            pacienteNome: 'Maria Silva',
            titulo: 'Avaliação Inicial',
            conteudo: 'Paciente apresenta sintomas de ansiedade generalizada, com foco em questões profissionais. Relata dificuldades para dormir e concentração. Recomendado início de terapia cognitivo-comportamental.',
            tipo: 'avaliacao',
            data: '2024-01-15'
        },
        {
            id: 2,
            pacienteId: 2,
            pacienteNome: 'João Santos',
            titulo: 'Primeira Sessão',
            conteudo: 'João demonstra baixa autoestima e sintomas depressivos. Relata isolamento social e perda de interesse em atividades que antes gostava. Iniciado processo de reestruturação cognitiva.',
            tipo: 'sessao',
            data: '2024-02-20'
        },
        {
            id: 3,
            pacienteId: 3,
            pacienteNome: 'Ana Costa',
            titulo: 'Avaliação de Casal',
            conteudo: 'Casal apresenta dificuldades de comunicação e conflitos recorrentes. Identificados padrões de comunicação disfuncional. Iniciado trabalho de terapia de casal.',
            tipo: 'avaliacao',
            data: '2024-03-10'
        }
    ];

    salvarDados();
}

// Salvar dados no localStorage
function salvarDados() {
    const dados = {
        pacientes: pacientes,
        sessoes: sessoes,
        notas: notas,
        perfil: perfil,
        configuracoes: configuracoes
    };
    localStorage.setItem('equilibrar_dados_psicologo', JSON.stringify(dados));
}

// Carregar dados iniciais
function carregarDadosIniciais() {
    carregarPacientes();
    carregarSessoes();
    carregarNotas();
    gerarCalendario();
    carregarAlertas();
    atualizarPerfil();
    carregarTema();
}

// Carregar dados de exemplo se não existirem
function carregarDadosExemplo() {
    const dadosExistentes = localStorage.getItem('equilibrar_dados_psicologo');
    if (!dadosExistentes) {
        carregarDadosMockados();
        // Dados de exemplo carregados silenciosamente
    }
}

// Atualizar dashboard com dados reais
function atualizarDashboardReal() {
    // Total de pacientes
    const totalPacientes = document.getElementById('total-pacientes');
    if (totalPacientes) {
        totalPacientes.textContent = pacientes.length;
    }
    
    // Sessões hoje
    const hoje = new Date().toISOString().split('T')[0];
    const sessoesHoje = sessoes.filter(s => s.data === hoje);
    const sessoesHojeElement = document.getElementById('sessoes-hoje');
    if (sessoesHojeElement) {
        sessoesHojeElement.textContent = sessoesHoje.length;
    }
    
    // Pacientes ativos
    const pacientesAtivos = pacientes.filter(p => p.status === 'ativo').length;
    const pacientesAtivosElement = document.getElementById('pacientes-ativos');
    if (pacientesAtivosElement) {
        pacientesAtivosElement.textContent = pacientesAtivos;
    }
    
    // Alertas
    const alertas = pacientes.filter(p => p.status === 'alerta').length;
    const alertasElement = document.getElementById('alertas');
    if (alertasElement) {
        alertasElement.textContent = alertas;
    }
    
    // Atualizar próxima sessão
    atualizarProximaSessao();
}

// Inicializar eventos com funcionalidades melhoradas
function inicializarEventos() {
    // Busca de pacientes com debounce
    const searchPacientes = document.getElementById('search-pacientes');
    if (searchPacientes) {
        let timeoutId;
        searchPacientes.addEventListener('input', function() {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                filtrarPacientes();
            }, 300);
        });
    }

    // Filtros de sessões
    const filtroSessoes = document.getElementById('filtro-sessoes');
    if (filtroSessoes) {
        filtroSessoes.addEventListener('change', filtrarSessoes);
    }

    // Eventos de teclado para navegação
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    navegarParaComTransicao('dashboard');
                    break;
                case '2':
                    e.preventDefault();
                    navegarParaComTransicao('pacientes');
                    break;
                case '3':
                    e.preventDefault();
                    navegarParaComTransicao('sessoes');
                    break;
                case '4':
                    e.preventDefault();
                    navegarParaComTransicao('relatorios');
                    break;
            }
        }
    });
}

// Atualizar próxima sessão
function atualizarProximaSessao() {
    const proximaSessaoCard = document.getElementById('proxima-sessao-card');
    if (!proximaSessaoCard) return;
    
    const hoje = new Date();
    const sessoesFuturas = sessoes
        .filter(s => new Date(s.data + 'T' + s.hora) > hoje && s.status === 'agendada')
        .sort((a, b) => new Date(a.data + 'T' + a.hora) - new Date(b.data + 'T' + b.hora));
    
    if (sessoesFuturas.length > 0) {
        const proximaSessao = sessoesFuturas[0];
        proximaSessaoCard.innerHTML = `
            <div class="sessao-info">
                <h4>${proximaSessao.pacienteNome}</h4>
                <p><i class="fas fa-calendar"></i> ${formatarData(proximaSessao.data)} às ${proximaSessao.hora}</p>
                <p><i class="fas fa-clock"></i> ${proximaSessao.duracao} minutos</p>
                <p><i class="fas fa-video"></i> ${proximaSessao.tipo}</p>
            </div>
            <div class="sessao-actions">
                <button class="btn btn-primary" onclick="iniciarSessao(${proximaSessao.id})">
                    <i class="fas fa-play"></i>
                    Iniciar Sessão
                </button>
                <button class="btn btn-secondary" onclick="editarSessao(${proximaSessao.id})">
                    <i class="fas fa-edit"></i>
                    Editar
                </button>
            </div>
        `;
    } else {
        proximaSessaoCard.innerHTML = `
            <div class="sessao-info">
                <h4>Nenhuma sessão agendada</h4>
                <p>Não há sessões futuras agendadas</p>
            </div>
            <div class="sessao-actions">
                <button class="btn btn-primary" onclick="navegarParaComTransicao('agenda')">
                    <i class="fas fa-calendar-plus"></i>
                    Agendar Sessão
                </button>
            </div>
        `;
    }
}

// Carregar pacientes com design melhorado
function carregarPacientes() {
    const pacientesGrid = document.getElementById('pacientes-grid');
    if (!pacientesGrid) return;

    pacientesGrid.innerHTML = '';

    if (pacientes.length === 0) {
        pacientesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-users"></i>
                <p>Nenhum paciente cadastrado.</p>
            </div>
        `;
        return;
    }

    pacientes.forEach(paciente => {
        const card = document.createElement('div');
        card.className = 'paciente-card';
        
        const humorEmoji = getHumorEmoji(paciente.humorAtual);
        const statusClass = paciente.status;
        
        card.innerHTML = `
            <div class="paciente-header">
                <div class="paciente-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="paciente-info">
                    <h3>${paciente.nome}</h3>
                    <span class="paciente-status ${statusClass}">${getStatusText(paciente.status)}</span>
                </div>
            </div>
            <div class="paciente-stats">
                <div class="stat">
                    <span class="stat-label">Último registro</span>
                    <span class="stat-value">${formatarDataHora(paciente.ultimoRegistro)}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Humor atual</span>
                    <span class="stat-value">${humorEmoji} ${getHumorText(paciente.humorAtual)} (${paciente.humorValor || '--'}/10)</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Próxima sessão</span>
                    <span class="stat-value">${formatarProximaSessao(paciente.proximaSessao)}</span>
                </div>
            </div>
            <div class="paciente-actions">
                <button class="btn btn-primary" onclick="verPaciente(${paciente.id})">
                    <i class="fas fa-eye"></i>
                    Ver Detalhes
                </button>
            </div>
        `;
        pacientesGrid.appendChild(card);
    });
}

// Funções auxiliares para formatação
function getHumorEmoji(humor) {
    const emojis = {
        'feliz': '😊',
        'triste': '😔',
        'ansioso': '😰',
        'calmo': '😌',
        'neutro': '😐',
        'irritado': '😤',
        'estressado': '😫'
    };
    return emojis[humor] || '--';
}

function getHumorText(humor) {
    const textos = {
        'feliz': 'Feliz',
        'triste': 'Triste',
        'ansioso': 'Ansioso',
        'calmo': 'Calmo',
        'neutro': 'Neutro',
        'irritado': 'Irritado',
        'estressado': 'Estressado'
    };
    return textos[humor] || '--';
}

function getStatusText(status) {
    const textos = {
        'ativo': 'Ativo',
        'alerta': 'Requer Atenção',
        'inativo': 'Inativo'
    };
    return textos[status] || status;
}

function formatarDataHora(dataHora) {
    if (!dataHora) return '--';
    const data = new Date(dataHora);
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);
    
    if (data.toDateString() === hoje.toDateString()) {
        return `Hoje, ${data.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}`;
    } else if (data.toDateString() === ontem.toDateString()) {
        return `Ontem, ${data.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}`;
    } else {
        return data.toLocaleDateString('pt-BR');
    }
}

function formatarProximaSessao(dataHora) {
    if (!dataHora) return 'Não agendada';
    const data = new Date(dataHora);
    return data.toLocaleDateString('pt-BR') + ' - ' + data.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
}

// Filtrar pacientes com funcionalidade melhorada
function filtrarPacientes() {
    const termo = document.getElementById('search-pacientes').value.toLowerCase();
    const pacientesFiltrados = pacientes.filter(paciente => 
        paciente.nome.toLowerCase().includes(termo) ||
        paciente.email.toLowerCase().includes(termo) ||
        paciente.telefone.includes(termo) ||
        paciente.motivo.toLowerCase().includes(termo)
    );

    const pacientesGrid = document.getElementById('pacientes-grid');
    pacientesGrid.innerHTML = '';

    if (pacientesFiltrados.length === 0) {
        pacientesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>Nenhum paciente encontrado para "${termo}".</p>
            </div>
        `;
        return;
    }

    pacientesFiltrados.forEach(paciente => {
        const card = document.createElement('div');
        card.className = 'paciente-card';
        
        const humorEmoji = getHumorEmoji(paciente.humorAtual);
        const statusClass = paciente.status;
        
        card.innerHTML = `
            <div class="paciente-header">
                <div class="paciente-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="paciente-info">
                    <h3>${paciente.nome}</h3>
                    <span class="paciente-status ${statusClass}">${getStatusText(paciente.status)}</span>
                </div>
            </div>
            <div class="paciente-stats">
                <div class="stat">
                    <span class="stat-label">Último registro</span>
                    <span class="stat-value">${formatarDataHora(paciente.ultimoRegistro)}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Humor atual</span>
                    <span class="stat-value">${humorEmoji} ${getHumorText(paciente.humorAtual)} (${paciente.humorValor || '--'}/10)</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Próxima sessão</span>
                    <span class="stat-value">${formatarProximaSessao(paciente.proximaSessao)}</span>
                </div>
            </div>
            <div class="paciente-actions">
                <button class="btn btn-primary" onclick="verPaciente(${paciente.id})">
                    <i class="fas fa-eye"></i>
                    Ver Detalhes
                </button>
            </div>
        `;
        pacientesGrid.appendChild(card);
    });
}

// Carregar sessões com design melhorado
function carregarSessoes() {
    const sessoesLista = document.getElementById('sessoes-lista');
    if (!sessoesLista) return;

    sessoesLista.innerHTML = '';

    if (sessoes.length === 0) {
        sessoesLista.innerHTML = `
            <div class="no-results">
                <i class="fas fa-calendar"></i>
                <p>Nenhuma sessão agendada.</p>
            </div>
        `;
        return;
    }

    sessoes.forEach(sessao => {
        const item = document.createElement('div');
        item.className = `sessao-item ${sessao.status}`;
        item.innerHTML = `
            <div class="sessao-header">
                <h4>${sessao.pacienteNome}</h4>
                <span class="sessao-status ${sessao.status}">${getStatusSessaoText(sessao.status)}</span>
            </div>
            <div class="sessao-info">
                <p><i class="fas fa-calendar"></i> ${formatarData(sessao.data)} às ${sessao.hora}</p>
                <p><i class="fas fa-clock"></i> ${sessao.duracao} minutos</p>
                <p><i class="fas fa-video"></i> ${sessao.tipo}</p>
            </div>
            ${sessao.observacoes ? `<p class="sessao-observacoes"><strong>Observações:</strong> ${sessao.observacoes}</p>` : ''}
            <div class="sessao-actions">
                <button class="btn btn-primary" onclick="iniciarSessao(${sessao.id})">
                    <i class="fas fa-play"></i> Iniciar
                </button>
                <button class="btn btn-secondary" onclick="editarSessao(${sessao.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger" onclick="cancelarSessao(${sessao.id})">
                    <i class="fas fa-times"></i> Cancelar
                </button>
            </div>
        `;
        sessoesLista.appendChild(item);
    });
}

function getStatusSessaoText(status) {
    const textos = {
        'agendada': 'Agendada',
        'em-andamento': 'Em Andamento',
        'concluida': 'Concluída',
        'cancelada': 'Cancelada'
    };
    return textos[status] || status;
}

// Filtrar sessões
function filtrarSessoes() {
    const filtro = document.getElementById('filtro-sessoes');
    if (!filtro) return;
    
    const status = filtro.value;
    let sessoesFiltradas = [...sessoes];
    
    if (status !== 'todas') {
        sessoesFiltradas = sessoesFiltradas.filter(s => s.status === status);
    }
    
    const sessoesLista = document.getElementById('sessoes-lista');
    sessoesLista.innerHTML = '';
    
    if (sessoesFiltradas.length === 0) {
        sessoesLista.innerHTML = `
            <div class="no-results">
                <i class="fas fa-calendar"></i>
                <p>Nenhuma sessão encontrada.</p>
            </div>
        `;
        return;
    }
    
    sessoesFiltradas.forEach(sessao => {
        const item = document.createElement('div');
        item.className = `sessao-item ${sessao.status}`;
        item.innerHTML = `
            <div class="sessao-header">
                <h4>${sessao.pacienteNome}</h4>
                <span class="sessao-status ${sessao.status}">${getStatusSessaoText(sessao.status)}</span>
            </div>
            <div class="sessao-info">
                <p><i class="fas fa-calendar"></i> ${formatarData(sessao.data)} às ${sessao.hora}</p>
                <p><i class="fas fa-clock"></i> ${sessao.duracao} minutos</p>
                <p><i class="fas fa-video"></i> ${sessao.tipo}</p>
            </div>
            <div class="sessao-actions">
                <button class="btn btn-primary" onclick="iniciarSessao(${sessao.id})">
                    <i class="fas fa-play"></i> Iniciar
                </button>
                <button class="btn btn-secondary" onclick="editarSessao(${sessao.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger" onclick="cancelarSessao(${sessao.id})">
                    <i class="fas fa-times"></i> Cancelar
                </button>
            </div>
        `;
        sessoesLista.appendChild(item);
    });
}





// Carregar alertas melhorados
function carregarAlertas() {
    const alertas = [];
    
    // Alertas de sessões próximas
    const hoje = new Date();
    const proximasSessoes = sessoes.filter(s => {
        const dataSessao = new Date(s.data + 'T' + s.hora);
        const diff = dataSessao - hoje;
        return diff > 0 && diff <= 24 * 60 * 60 * 1000; // Próximas 24h
    });
    
    proximasSessoes.forEach(sessao => {
        alertas.push({
            tipo: 'info',
            mensagem: `Sessão com ${sessao.pacienteNome} em ${formatarData(sessao.data)} às ${sessao.hora}`,
            icone: 'fas fa-calendar'
        });
    });
    
    // Alertas de pacientes sem sessão recente
    const umaSemanaAtras = new Date();
    umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);
    
    pacientes.forEach(paciente => {
        const ultimaSessao = sessoes
            .filter(s => s.pacienteId === paciente.id)
            .sort((a, b) => new Date(b.data) - new Date(a.data))[0];
        
        if (ultimaSessao && new Date(ultimaSessao.data) < umaSemanaAtras) {
            alertas.push({
                tipo: 'warning',
                mensagem: `Paciente ${paciente.nome} sem sessão há mais de uma semana`,
                icone: 'fas fa-exclamation-triangle'
            });
        }
    });
    
    // Sistema de alertas removido para simplificar a interface
}

// Funções de ação melhoradas
function verPaciente(pacienteId) {
    const paciente = pacientes.find(p => p.id === pacienteId);
    if (paciente) {
        // Visualizando paciente silenciosamente
        // Aqui você poderia abrir um modal com detalhes completos do paciente
    }
}

function iniciarSessao(sessaoId) {
    const sessao = sessoes.find(s => s.id === sessaoId);
    if (sessao) {
        sessao.status = 'em-andamento';
        salvarDados();
        carregarSessoes();
    }
}

function editarSessao(sessaoId) {
    const sessao = sessoes.find(s => s.id === sessaoId);
    if (sessao) {
        // Aqui você poderia abrir um modal para editar a sessão
    }
}

function cancelarSessao(sessaoId) {
    const sessao = sessoes.find(s => s.id === sessaoId);
    if (sessao && confirm(`Deseja cancelar a sessão com ${sessao.pacienteNome}?`)) {
        sessao.status = 'cancelada';
        salvarDados();
        carregarSessoes();
    }
}





// Mostrar notificação melhorada
// Sistema de notificações removido para simplificar a interface

// Formatar data
function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}

// Logout
function logout() {
    localStorage.removeItem('equilibrar_usuario_atual');
    window.location.href = 'login.html';
}

// Sistema de backup automático
function criarBackupAutomatico() {
    const dados = {
        pacientes: pacientes,
        sessoes: sessoes,
        notas: notas,
        dataBackup: new Date().toISOString(),
        versao: '1.0'
    };
    
    localStorage.setItem('equilibrar_backup_psico', JSON.stringify(dados));
    
    const backups = JSON.parse(localStorage.getItem('equilibrar_backups_psico') || '[]');
    backups.push(dados);
    
    if (backups.length > 5) {
        backups.shift();
    }
    
    localStorage.setItem('equilibrar_backups_psico', JSON.stringify(backups));
}

// Restaurar backup
function restaurarBackup() {
    const backup = localStorage.getItem('equilibrar_backup_psico');
    if (backup) {
        try {
            const dados = JSON.parse(backup);
            pacientes = dados.pacientes || [];
            sessoes = dados.sessoes || [];
            notas = dados.notas || [];
            
            salvarDados();
            carregarPacientes();
            carregarSessoes();
            carregarNotas();
            
            // Backup restaurado com sucesso
        } catch (error) {
            // Erro ao restaurar backup
        }
    } else {
        // Nenhum backup encontrado
    }
}

// Sistema de temas
function alternarTema() {
    const body = document.body;
    const temaAtual = localStorage.getItem('equilibrar_tema') || 'claro';
    const novoTema = temaAtual === 'claro' ? 'escuro' : 'claro';
    
    body.classList.toggle('tema-escuro');
    localStorage.setItem('equilibrar_tema', novoTema);
    
    // Tema alterado
}

// Carregar tema salvo
function carregarTema() {
    const tema = localStorage.getItem('equilibrar_tema') || 'claro';
    if (tema === 'escuro') {
        document.body.classList.add('tema-escuro');
    }
}

// Funções para navegação rápida
function navegarParaDashboard() {
    navegarParaComTransicao('dashboard');
}

function navegarParaPacientes() {
    navegarParaComTransicao('pacientes');
}

function navegarParaSessoes() {
    navegarParaComTransicao('sessoes');
}

function navegarParaRelatorios() {
    navegarParaComTransicao('relatorios');
}



function iniciarSessao(sessaoId) {
    const sessao = sessoes.find(s => s.id === sessaoId);
    if (sessao) {
        sessao.status = 'em-andamento';
        salvarDados();

        carregarSessoes();
    }
}

function editarSessao(sessaoId) {
    const sessao = sessoes.find(s => s.id === sessaoId);
    if (sessao) {

        // Implementar modal de edição
    }
}

// Funções para configurações
function salvarHorarios() {
    const horarios = {};
    document.querySelectorAll('.horario-inputs input').forEach((input, index) => {
        const dia = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'][Math.floor(index / 2)];
        const tipo = index % 2 === 0 ? 'inicio' : 'fim';
        if (!horarios[dia]) horarios[dia] = {};
        horarios[dia][tipo] = input.value;
    });
    
    localStorage.setItem('equilibrar_horarios', JSON.stringify(horarios));

}

function restaurarHorarios() {
    const horariosPadrao = {
        segunda: { inicio: '08:00', fim: '18:00' },
        terca: { inicio: '08:00', fim: '18:00' },
        quarta: { inicio: '08:00', fim: '18:00' },
        quinta: { inicio: '08:00', fim: '18:00' },
        sexta: { inicio: '08:00', fim: '18:00' },
        sabado: { inicio: '09:00', fim: '14:00' }
    };
    
    document.querySelectorAll('.horario-inputs input').forEach((input, index) => {
        const dia = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'][Math.floor(index / 2)];
        const tipo = index % 2 === 0 ? 'inicio' : 'fim';
        input.value = horariosPadrao[dia][tipo];
    });
    
    localStorage.setItem('equilibrar_horarios', JSON.stringify(horariosPadrao));

}

function editarPerfil() {
    const nome = prompt('Digite o novo nome:');
    if (nome) {
        usuarioAtual.nome = nome;
        localStorage.setItem('equilibrar_usuario_atual', JSON.stringify(usuarioAtual));
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = nome;
        }
        
        // Perfil atualizado com sucesso
    }
}

function alterarSenha() {
    const senhaAtual = prompt('Digite a senha atual:');
    const novaSenha = prompt('Digite a nova senha:');
    const confirmarSenha = prompt('Confirme a nova senha:');
    
    if (novaSenha !== confirmarSenha) {
        // Senhas não coincidem
        return;
    }
    
    if (novaSenha.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres');
        return;
    }
    
    // Em uma aplicação real, aqui seria feita a validação da senha atual
    // e a atualização no servidor

}

// Salvar configurações de notificações
function salvarConfiguracoesNotificacoes() {
    const configs = {};
    const checkboxes = document.querySelectorAll('.notificacoes-config input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        configs[checkbox.id] = checkbox.checked;
    });
    
    localStorage.setItem('equilibrar_config_notificacoes_psico', JSON.stringify(configs));
    
    // Configurações salvas
}

// Salvar configurações de privacidade
function salvarConfiguracoesPrivacidade() {
    const configs = {};
    const checkboxes = document.querySelectorAll('.privacidade-config input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        configs[checkbox.id] = checkbox.checked;
    });
    
    localStorage.setItem('equilibrar_config_privacidade_psico', JSON.stringify(configs));
    
    // Configurações salvas
}

// Funções para temas
function aplicarTema(tema) {
    const body = document.body;
    
    // Remover classes de tema existentes
    body.classList.remove('tema-claro', 'tema-escuro', 'tema-auto');
    
    // Aplicar novo tema
    body.classList.add(`tema-${tema}`);
    localStorage.setItem('equilibrar_tema', tema);
    
    // Atualizar previews
    const previews = document.querySelectorAll('.tema-preview');
    previews.forEach(preview => {
        preview.classList.remove('active');
    });
    
    const previewAtivo = document.querySelector(`.tema-preview.${tema}`);
    if (previewAtivo) {
        previewAtivo.classList.add('active');
    }
    
    // Tema aplicado
}

// Event listeners para temas
document.addEventListener('DOMContentLoaded', function() {
    // Configurar listeners para temas
    const temaRadios = document.querySelectorAll('input[name="tema"]');
    temaRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            aplicarTema(this.value);
        });
    });
    
    // Carregar tema salvo
    const temaSalvo = localStorage.getItem('equilibrar_tema') || 'claro';
    const radioTema = document.querySelector(`input[name="tema"][value="${temaSalvo}"]`);
    if (radioTema) {
        radioTema.checked = true;
        aplicarTema(temaSalvo);
    }
    
    // Carregar horários salvos
    const horariosSalvos = localStorage.getItem('equilibrar_horarios');
    if (horariosSalvos) {
        const horarios = JSON.parse(horariosSalvos);
        document.querySelectorAll('.horario-inputs input').forEach((input, index) => {
            const dia = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'][Math.floor(index / 2)];
            const tipo = index % 2 === 0 ? 'inicio' : 'fim';
            if (horarios[dia] && horarios[dia][tipo]) {
                input.value = horarios[dia][tipo];
            }
        });
    }
    
    // Configurar listeners para configurações
    inicializarEventosConfiguracoes();
});

// Inicializar eventos de configurações
function inicializarEventosConfiguracoes() {
    // Event listeners para checkboxes de notificações
    document.querySelectorAll('.notificacoes-config input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', salvarConfiguracoesNotificacoes);
    });
    
    // Event listeners para checkboxes de privacidade
    document.querySelectorAll('.privacidade-config input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', salvarConfiguracoesPrivacidade);
    });
    
    // Carregar configurações salvas
    carregarConfiguracoesSalvas();
}

// Carregar configurações salvas
function carregarConfiguracoesSalvas() {
    // Carregar configurações de notificações
    const configNotificacoes = JSON.parse(localStorage.getItem('equilibrar_config_notificacoes_psico') || '{}');
    document.querySelectorAll('.notificacoes-config input[type="checkbox"]').forEach(checkbox => {
        const label = checkbox.nextElementSibling.textContent;
        if (configNotificacoes[label] !== undefined) {
            checkbox.checked = configNotificacoes[label];
        }
    });
    
    // Carregar configurações de privacidade
    const configPrivacidade = JSON.parse(localStorage.getItem('equilibrar_config_privacidade_psico') || '{}');
    document.querySelectorAll('.privacidade-config input[type="checkbox"]').forEach(checkbox => {
        const label = checkbox.nextElementSibling.textContent;
        if (configPrivacidade[label] !== undefined) {
            checkbox.checked = configPrivacidade[label];
        }
    });
}





// Funções para recursos
function acessarRecurso(tipo) {
    const recursos = {
        'exercicios': 'Carregando exercícios de relaxamento...',
        'meditacao': 'Iniciando sessão de meditação...',
        'artigos': 'Carregando artigos sobre bem-estar...',
        'videos': 'Reproduzindo vídeos educativos...'
    };
    
    // Acessando recurso
    setTimeout(() => {
        // Recurso carregado com sucesso
    }, 2000);
}

// Funções para gerenciamento de pacientes
function adicionarPaciente() {
    const nome = prompt('Digite o nome do paciente:');
    if (!nome) return;
    
    const email = prompt('Digite o email:');
    const telefone = prompt('Digite o telefone:');
    const dataNascimento = prompt('Digite a data de nascimento (YYYY-MM-DD):');
    
    const novoPaciente = {
        id: pacientes.length + 1,
        nome: nome,
        email: email,
        telefone: telefone,
        dataNascimento: dataNascimento,
        status: 'ativo',
        dataCadastro: new Date().toISOString(),
        humorAtual: 'neutro',
        ultimaSessao: null,
        proximaSessao: null
    };
    
    pacientes.push(novoPaciente);
    salvarDados();
    carregarPacientes();
    
    // Paciente adicionado com sucesso
}

function verDetalhesPaciente(pacienteId) {
    const paciente = pacientes.find(p => p.id === pacienteId);
    if (!paciente) {
        // Paciente não encontrado
        return;
    }
    
    // Aqui você poderia abrir um modal com detalhes completos do paciente
}

// Atualizar perfil
function atualizarPerfil() {
    const perfilSalvo = localStorage.getItem('equilibrar_perfil_psicologo');
    if (perfilSalvo) {
        perfil = JSON.parse(perfilSalvo);
    } else {
        perfil = {
            nome: usuarioAtual.nome,
            email: usuarioAtual.email,
            especialidade: 'Psicologia Clínica',
            crm: '12345',
            telefone: '(11) 99999-9999',
            endereco: 'São Paulo, SP',
            bio: 'Psicólogo clínico com mais de 10 anos de experiência.'
        };
        localStorage.setItem('equilibrar_perfil_psicologo', JSON.stringify(perfil));
    }
} 

// Obter título da seção
function getTituloSecao(sectionId) {
    const titulos = {
        'dashboard': 'Dashboard',
        'pacientes': 'Pacientes',
        'sessoes': 'Sessões',
        'relatorios': 'Relatórios',
        'agenda': 'Agenda',
        'notas': 'Notas Clínicas',
        'recursos': 'Recursos',
        'configuracoes': 'Configurações'
    };
    
    return titulos[sectionId] || 'Página';
}

// Inicializar indicador de página
function inicializarPageIndicator() {
    const pageIndicator = document.getElementById('page-indicator');
    if (pageIndicator) {
        // Definir progresso inicial
        pageIndicator.style.setProperty('--progress', '0%');
        
        // Atualizar progresso baseado no scroll
        window.addEventListener('scroll', debounce(function() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.offsetHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            pageIndicator.style.setProperty('--progress', `${scrollPercent}%`);
        }, 10));
    }
} 

// Atualizar título da página baseado na seção
function atualizarTituloPagina(sectionId) {
    const titulos = {
        'dashboard': 'Dashboard - Equilibrar',
        'pacientes': 'Pacientes - Equilibrar',
        'sessoes': 'Sessões - Equilibrar',
        'recursos': 'Recursos - Equilibrar',
        'configuracoes': 'Configurações - Equilibrar'
    };
    
    const titulo = titulos[sectionId] || 'Equilibrar';
    document.title = titulo;
}

// Atualizar navegação ativa baseada na seção visível
function atualizarNavegacaoAtiva() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + 100;
    const pageIndicator = document.getElementById('page-indicator');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            const sectionId = section.id;
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === sectionId) {
                    link.classList.add('active');
                    
                    // Atualizar indicador de página
                    if (pageIndicator) {
                        const progress = Math.min(100, Math.max(0, 
                            ((scrollPosition - sectionTop) / sectionHeight) * 100
                        ));
                        pageIndicator.style.setProperty('--progress', `${progress}%`);
                    }
                }
            });
        }
    });
}

// Função para adicionar efeito de pulse
function adicionarEfeitoPulse(elemento) {
    elemento.style.animation = 'pulse 0.5s ease';
    setTimeout(() => {
        elemento.style.animation = '';
    }, 500);
}

// Melhorar feedback visual da navegação
function melhorarFeedbackNavegacao(sectionId) {
    const navLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (navLink) {
        adicionarEfeitoPulse(navLink);
        
        // Adicionar efeito de ripple
        const rect = navLink.getBoundingClientRect();
        const ripple = document.createElement('div');
        ripple.className = 'nav-ripple';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.marginLeft = '-10px';
        ripple.style.marginTop = '-10px';
        navLink.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

 