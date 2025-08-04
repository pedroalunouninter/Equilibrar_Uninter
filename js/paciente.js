// Variáveis globais
let registros = [];
let metas = [];
let perfil = {};
let graficos = {};
let usuarioAtual = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarUsuarioAtual();
    carregarDados();
    inicializarEventos();
    inicializarSidebar();
    atualizarDashboard();
    gerarDicas();
    inicializarGraficos();
    definirDataAtual();
    carregarHistorico();
    carregarMetas();
    atualizarPerfil();
    carregarSessoes();
    carregarTema();
    
    // Backup automático
    const ultimoBackup = localStorage.getItem('equilibrar_ultimo_backup');
    const agora = new Date().getTime();
    const umDia = 24 * 60 * 60 * 1000;
    
    if (!ultimoBackup || (agora - parseInt(ultimoBackup)) > umDia) {
        criarBackupAutomatico();
        localStorage.setItem('equilibrar_ultimo_backup', agora.toString());
    }
});

// Carregar usuário atual do localStorage
function carregarUsuarioAtual() {
    const usuarioSalvo = localStorage.getItem('equilibrar_usuario_atual');
    if (usuarioSalvo) {
        usuarioAtual = JSON.parse(usuarioSalvo);
    } else {
        // Criar usuário de exemplo se não existir
        usuarioAtual = {
            id: 'maria_silva',
            nome: 'Maria Silva',
            email: 'maria.silva@email.com',
            tipo: 'paciente',
            dataCriacao: new Date().toISOString()
        };
        localStorage.setItem('equilibrar_usuario_atual', JSON.stringify(usuarioAtual));
    }
    
    // Atualizar nome do usuário na interface
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = usuarioAtual.nome;
    }
}

// Inicializar sidebar
function inicializarSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
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
    
    // Navegação ativa
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remover classe ativa de todos os links
            navLinks.forEach(l => l.classList.remove('active'));
            // Adicionar classe ativa ao link clicado
            this.classList.add('active');
            
            // Fechar sidebar em dispositivos móveis
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('open');
            }
        });
    });
    
    // Marcar link ativo baseado na seção atual
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Carregar dados do localStorage
function carregarDados() {
    const dadosSalvos = localStorage.getItem('equilibrar_dados_paciente');
    if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        registros = dados.registros || [];
        metas = dados.metas || [];
        perfil = dados.perfil || {};
    }
}

// Salvar dados no localStorage
function salvarDados() {
    const dados = {
        registros: registros,
        metas: metas,
        perfil: perfil
    };
    localStorage.setItem('equilibrar_dados_paciente', JSON.stringify(dados));
}

// Inicializar eventos
function inicializarEventos() {
    // Formulário de registro
    const registroForm = document.getElementById('registroForm');
    if (registroForm) {
        registroForm.addEventListener('submit', processarRegistro);
    }

    // Formulário de metas
    const metasForm = document.getElementById('metasForm');
    if (metasForm) {
        metasForm.addEventListener('submit', processarMeta);
    }

    // Formulário de perfil
    const perfilForm = document.getElementById('perfilForm');
    if (perfilForm) {
        perfilForm.addEventListener('submit', processarPerfil);
    }

    // Formulário de feedback
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', processarFeedback);
    }

    // Range do estresse
    const estresseRange = document.getElementById('estresse');
    const estresseValue = document.getElementById('estresseValue');
    if (estresseRange && estresseValue) {
        estresseRange.addEventListener('input', function() {
            estresseValue.textContent = this.value;
        });
    }

    // Filtro de período
    const filtroPeriodo = document.getElementById('filtroPeriodo');
    if (filtroPeriodo) {
        filtroPeriodo.addEventListener('change', carregarHistorico);
    }

    // Período dos gráficos
    const periodoGrafico = document.getElementById('periodoGrafico');
    if (periodoGrafico) {
        periodoGrafico.addEventListener('change', atualizarGraficos);
    }

    // Botão gerar PDF
    const btnGerarPDF = document.getElementById('btnGerarPDF');
    if (btnGerarPDF) {
        btnGerarPDF.addEventListener('click', gerarRelatorioPDF);
    }
}

// Definir data atual no formulário
function definirDataAtual() {
    const dataInput = document.getElementById('data');
    if (dataInput) {
        const hoje = new Date().toISOString().split('T')[0];
        dataInput.value = hoje;
    }
}

// Processar registro
function processarRegistro(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const registro = {
        id: Date.now(),
        data: formData.get('data'),
        sono: parseFloat(formData.get('sono')),
        humor: parseInt(formData.get('humor')),
        estresse: parseInt(formData.get('estresse')),
        atividade: parseInt(formData.get('atividade')),
        alimentacao: parseInt(formData.get('alimentacao')),
        observacoes: formData.get('observacoes'),
        timestamp: new Date().toISOString()
    };

    registros.push(registro);
    salvarDados();
    
            // Registro salvo silenciosamente
    limparFormulario();
    atualizarDashboard();
    carregarHistorico();
    atualizarGraficos();
    gerarDicas();
}

// Limpar formulário
function limparFormulario() {
    const form = document.getElementById('registroForm');
    if (form) {
        form.reset();
        definirDataAtual();
        document.getElementById('estresseValue').textContent = '5';
    }
}

// Atualizar dashboard
function atualizarDashboard() {
    if (registros.length === 0) return;

    const ultimosRegistros = registros.slice(-7);
    const registroAtual = registros[registros.length - 1];
    const registroAnterior = registros.length > 1 ? registros[registros.length - 2] : null;

    // Atualizar cards
    document.getElementById('sonoResumo').textContent = `${registroAtual.sono}h`;
    document.getElementById('humorResumo').textContent = getHumorText(registroAtual.humor);
    document.getElementById('estresseResumo').textContent = `${registroAtual.estresse}/10`;
    document.getElementById('atividadeResumo').textContent = `${registroAtual.atividade}min`;

    // Atualizar tendências
    if (registroAnterior) {
        atualizarTendencia('sono', registroAtual.sono, registroAnterior.sono);
        atualizarTendencia('humor', registroAtual.humor, registroAnterior.humor);
        atualizarTendencia('estresse', registroAtual.estresse, registroAnterior.estresse);
        atualizarTendencia('atividade', registroAtual.atividade, registroAnterior.atividade);
    }

    atualizarStreak();
}

// Atualizar tendência
function atualizarTendencia(tipo, valorAtual, valorAnterior) {
    const trendElement = document.getElementById(`${tipo}Trend`);
    if (!trendElement) return;

    const diferenca = valorAtual - valorAnterior;
    const percentual = ((diferenca / valorAnterior) * 100).toFixed(1);

    if (diferenca > 0) {
        trendElement.textContent = `+${percentual}%`;
        trendElement.className = 'card-trend positive';
    } else if (diferenca < 0) {
        trendElement.textContent = `${percentual}%`;
        trendElement.className = 'card-trend negative';
    } else {
        trendElement.textContent = '0%';
        trendElement.className = 'card-trend';
    }
}

// Atualizar streak
function atualizarStreak() {
    const streak = calcularStreak();
    document.getElementById('streakDays').textContent = streak;
    document.getElementById('totalRegistros').textContent = registros.length;
    
    const metasCompletas = metas.filter(meta => meta.completa).length;
    document.getElementById('metasCompletas').textContent = metasCompletas;
}

// Obter texto do humor
function getHumorText(humor) {
    const humores = {
        1: '😞 Muito ruim',
        2: '😕 Ruim',
        3: '😐 Neutro',
        4: '🙂 Bom',
        5: '😃 Ótimo'
    };
    return humores[humor] || 'N/A';
}

// Carregar histórico
function carregarHistorico() {
    const historicoLista = document.getElementById('historicoLista');
    if (!historicoLista) return;

    const filtroPeriodo = document.getElementById('filtroPeriodo').value;
    let registrosFiltrados = [...registros];

    if (filtroPeriodo !== 'all') {
        const dias = parseInt(filtroPeriodo);
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() - dias);
        
        registrosFiltrados = registros.filter(registro => 
            new Date(registro.data) >= dataLimite
        );
    }

    historicoLista.innerHTML = '';

    if (registrosFiltrados.length === 0) {
        historicoLista.innerHTML = '<p class="text-center">Nenhum registro encontrado.</p>';
        return;
    }

    registrosFiltrados.reverse().forEach(registro => {
        const item = document.createElement('div');
        item.className = 'historico-item';
        item.innerHTML = `
            <div class="historico-header">
                <span class="historico-data">${formatarData(registro.data)}</span>
                <div class="historico-stats">
                    <div class="historico-stat">
                        <span>😴</span>
                        <span>${registro.sono}h</span>
                    </div>
                    <div class="historico-stat">
                        <span>😊</span>
                        <span>${getHumorText(registro.humor)}</span>
                    </div>
                    <div class="historico-stat">
                        <span>💪</span>
                        <span>${registro.estresse}/10</span>
                    </div>
                    <div class="historico-stat">
                        <span>🏃</span>
                        <span>${registro.atividade}min</span>
                    </div>
                </div>
            </div>
            ${registro.observacoes ? `<div class="historico-observacoes">${registro.observacoes}</div>` : ''}
        `;
        historicoLista.appendChild(item);
    });
}

// Processar meta
function processarMeta(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const meta = {
        id: Date.now(),
        titulo: formData.get('metaTitulo'),
        tipo: formData.get('metaTipo'),
        valor: parseFloat(formData.get('metaValor')),
        descricao: formData.get('metaDescricao'),
        criada: new Date().toISOString(),
        completa: false,
        progresso: 0
    };

    metas.push(meta);
    salvarDados();
    
            // Meta criada silenciosamente
    e.target.reset();
    carregarMetas();
    atualizarGraficos();
}

// Carregar metas
function carregarMetas() {
    const metasLista = document.getElementById('metasLista');
    if (!metasLista) return;

    metasLista.innerHTML = '';

    if (metas.length === 0) {
        metasLista.innerHTML = '<p class="text-center">Nenhuma meta criada ainda.</p>';
        return;
    }

    metas.forEach(meta => {
        const progresso = calcularProgressoMeta(meta);
        const item = document.createElement('div');
        item.className = 'meta-item';
        item.innerHTML = `
            <div class="meta-header">
                <h4 class="meta-titulo">${meta.titulo}</h4>
                <span class="meta-tipo">${meta.tipo}</span>
            </div>
            <div class="meta-progresso">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progresso}%"></div>
                </div>
                <span>${progresso.toFixed(1)}%</span>
            </div>
            <p>${meta.descricao}</p>
            <div class="meta-stats">
                <span>Meta: ${meta.valor}</span>
                <span>Atual: ${calcularValorAtual(meta)}</span>
            </div>
        `;
        metasLista.appendChild(item);
    });

    verificarMetas();
}

// Calcular progresso da meta
function calcularProgressoMeta(meta) {
    const valorAtual = calcularValorAtual(meta);
    return Math.min((valorAtual / meta.valor) * 100, 100);
}

// Calcular valor atual da meta
function calcularValorAtual(meta) {
    if (registros.length === 0) return 0;

    const ultimosRegistros = registros.slice(-7);
    
    switch (meta.tipo) {
        case 'sono':
            return ultimosRegistros.reduce((acc, r) => acc + r.sono, 0) / ultimosRegistros.length;
        case 'atividade':
            return ultimosRegistros.reduce((acc, r) => acc + r.atividade, 0) / ultimosRegistros.length;
        case 'estresse':
            return ultimosRegistros.reduce((acc, r) => acc + r.estresse, 0) / ultimosRegistros.length;
        case 'humor':
            return ultimosRegistros.reduce((acc, r) => acc + r.humor, 0) / ultimosRegistros.length;
        case 'alimentacao':
            return ultimosRegistros.reduce((acc, r) => acc + r.alimentacao, 0) / ultimosRegistros.length;
        default:
            return 0;
    }
}

// Verificar metas completas
function verificarMetas() {
    metas.forEach(meta => {
        if (!meta.completa && calcularProgressoMeta(meta) >= 100) {
            meta.completa = true;
            // Meta alcançada silenciosamente
        }
    });
    salvarDados();
}

// Processar perfil
function processarPerfil(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    perfil = {
        nome: formData.get('perfilNome'),
        idade: parseInt(formData.get('perfilIdade')),
        objetivo: formData.get('perfilObjetivo')
    };

    salvarDados();
            // Perfil atualizado silenciosamente
    atualizarPerfil();
}

// Atualizar perfil
function atualizarPerfil() {
    if (perfil.nome) {
        document.getElementById('perfilNome').value = perfil.nome;
    }
    if (perfil.idade) {
        document.getElementById('perfilIdade').value = perfil.idade;
    }
    if (perfil.objetivo) {
        document.getElementById('perfilObjetivo').value = perfil.objetivo;
    }

    atualizarEstatisticas();
}

// Atualizar estatísticas
function atualizarEstatisticas() {
    if (registros.length === 0) return;

    document.getElementById('totalDias').textContent = registros.length;
    
    const mediaSono = registros.reduce((acc, r) => acc + r.sono, 0) / registros.length;
    document.getElementById('mediaSono').textContent = `${mediaSono.toFixed(1)}h`;
    
    const mediaEstresse = registros.reduce((acc, r) => acc + r.estresse, 0) / registros.length;
    document.getElementById('mediaEstresse').textContent = mediaEstresse.toFixed(1);

    // Melhor dia (menor estresse)
    const melhorRegistro = registros.reduce((melhor, atual) => 
        atual.estresse < melhor.estresse ? atual : melhor
    );
    document.getElementById('melhorDia').textContent = formatarData(melhorRegistro.data);
}

// Inicializar gráficos
function inicializarGraficos() {
    // Gráfico de Sono
    const ctxSono = document.getElementById('graficoSono');
    if (ctxSono) {
        graficos.sono = new Chart(ctxSono, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Horas de Sono',
                    data: [],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Gráfico de Humor
    const ctxHumor = document.getElementById('graficoHumor');
    if (ctxHumor) {
        graficos.humor = new Chart(ctxHumor, {
            type: 'doughnut',
            data: {
                labels: ['Muito Ruim', 'Ruim', 'Neutro', 'Bom', 'Ótimo'],
                datasets: [{
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: [
                        '#ef4444',
                        '#f59e0b',
                        '#6b7280',
                        '#10b981',
                        '#3b82f6'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Gráfico de Estresse
    const ctxEstresse = document.getElementById('graficoEstresse');
    if (ctxEstresse) {
        graficos.estresse = new Chart(ctxEstresse, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Nível de Estresse',
                    data: [],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        min: 1,
                        max: 10
                    }
                }
            }
        });
    }

    // Gráfico de Atividade
    const ctxAtividade = document.getElementById('graficoAtividade');
    if (ctxAtividade) {
        graficos.atividade = new Chart(ctxAtividade, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Minutos de Atividade',
                    data: [],
                    backgroundColor: '#10b981'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    atualizarGraficos();
}

// Atualizar gráficos
function atualizarGraficos() {
    if (registros.length === 0) return;

    const periodo = parseInt(document.getElementById('periodoGrafico').value);
    const registrosFiltrados = registros.slice(-periodo);

    // Atualizar gráfico de sono
    if (graficos.sono) {
        graficos.sono.data.labels = registrosFiltrados.map(r => formatarData(r.data));
        graficos.sono.data.datasets[0].data = registrosFiltrados.map(r => r.sono);
        graficos.sono.update();
    }

    // Atualizar gráfico de humor
    if (graficos.humor) {
        const contagemHumor = [0, 0, 0, 0, 0];
        registrosFiltrados.forEach(r => {
            if (r.humor >= 1 && r.humor <= 5) {
                contagemHumor[r.humor - 1]++;
            }
        });
        graficos.humor.data.datasets[0].data = contagemHumor;
        graficos.humor.update();
    }

    // Atualizar gráfico de estresse
    if (graficos.estresse) {
        graficos.estresse.data.labels = registrosFiltrados.map(r => formatarData(r.data));
        graficos.estresse.data.datasets[0].data = registrosFiltrados.map(r => r.estresse);
        graficos.estresse.update();
    }

    // Atualizar gráfico de atividade
    if (graficos.atividade) {
        graficos.atividade.data.labels = registrosFiltrados.map(r => formatarData(r.data));
        graficos.atividade.data.datasets[0].data = registrosFiltrados.map(r => r.atividade);
        graficos.atividade.update();
    }
}

// Gerar dicas
function gerarDicas() {
    const dicasLista = document.getElementById('dicasLista');
    if (!dicasLista || registros.length === 0) return;

    const ultimoRegistro = registros[registros.length - 1];
    const dicas = [];

    // Dicas baseadas no sono
    if (ultimoRegistro.sono < 7) {
        dicas.push({
            titulo: 'Melhore seu sono',
            descricao: 'Tente dormir pelo menos 7-8 horas por noite. Evite telas antes de dormir e mantenha um horário regular.',
            icone: 'fas fa-bed'
        });
    }

    // Dicas baseadas no estresse
    if (ultimoRegistro.estresse > 7) {
        dicas.push({
            titulo: 'Reduza o estresse',
            descricao: 'Pratique técnicas de respiração, meditação ou exercícios físicos para reduzir o estresse.',
            icone: 'fas fa-heartbeat'
        });
    }

    // Dicas baseadas na atividade física
    if (ultimoRegistro.atividade < 30) {
        dicas.push({
            titulo: 'Aumente a atividade física',
            descricao: 'Tente fazer pelo menos 30 minutos de atividade física por dia. Comece com caminhadas.',
            icone: 'fas fa-running'
        });
    }

    // Dicas baseadas no humor
    if (ultimoRegistro.humor <= 2) {
        dicas.push({
            titulo: 'Cuide do seu humor',
            descricao: 'Conecte-se com amigos, pratique hobbies ou busque ajuda profissional se necessário.',
            icone: 'fas fa-smile'
        });
    }

    // Dicas gerais se não houver dicas específicas
    if (dicas.length === 0) {
        dicas.push({
            titulo: 'Continue assim!',
            descricao: 'Seus dados mostram que você está cuidando bem da sua saúde mental. Mantenha os bons hábitos!',
            icone: 'fas fa-thumbs-up'
        });
    }

    dicasLista.innerHTML = '';
    dicas.forEach(dica => {
        const item = document.createElement('div');
        item.className = 'dica-item';
        item.innerHTML = `
            <i class="${dica.icone}"></i>
            <div>
                <h3>${dica.titulo}</h3>
                <p>${dica.descricao}</p>
            </div>
        `;
        dicasLista.appendChild(item);
    });
}

// Carregar sessões
function carregarSessoes() {
    const historicoSessoes = document.getElementById('historicoSessoes');
    if (!historicoSessoes) return;

    // Dados mockados das sessões
    const sessoes = [
        {
            data: '03/06/2024',
            descricao: 'Sessão sobre ansiedade',
            duracao: '50 min',
            status: 'Concluída'
        },
        {
            data: '27/05/2024',
            descricao: 'Sessão sobre autoconhecimento',
            duracao: '50 min',
            status: 'Concluída'
        },
        {
            data: '20/05/2024',
            descricao: 'Sessão sobre autoestima',
            duracao: '50 min',
            status: 'Concluída'
        }
    ];

    historicoSessoes.innerHTML = '';
    sessoes.forEach(sessao => {
        const item = document.createElement('div');
        item.className = 'sessao-item';
        item.innerHTML = `
            <div class="sessao-info">
                <i class="fas fa-calendar-check"></i>
                <div>
                    <h4>${sessao.data}</h4>
                    <p>${sessao.descricao}</p>
                    <span class="sessao-duracao">${sessao.duracao}</span>
                </div>
            </div>
            <span class="sessao-status">${sessao.status}</span>
        `;
        historicoSessoes.appendChild(item);
    });
}

// Gerar relatório PDF
function gerarRelatorioPDF() {
    if (typeof jsPDF === 'undefined') {
        mostrarNotificacao('Erro ao carregar biblioteca PDF', 'error');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Título
    doc.setFontSize(20);
    doc.text('Relatório de Bem-estar - Equilibrar', 20, 20);

    // Informações do usuário
    doc.setFontSize(12);
    doc.text(`Paciente: ${usuarioAtual ? usuarioAtual.nome : 'Usuário'}`, 20, 40);
    doc.text(`Data do relatório: ${new Date().toLocaleDateString('pt-BR')}`, 20, 50);

    // Estatísticas
    if (registros.length > 0) {
        doc.setFontSize(14);
        doc.text('Estatísticas Gerais:', 20, 70);
        
        const mediaSono = registros.reduce((acc, r) => acc + r.sono, 0) / registros.length;
        const mediaEstresse = registros.reduce((acc, r) => acc + r.estresse, 0) / registros.length;
        const mediaAtividade = registros.reduce((acc, r) => acc + r.atividade, 0) / registros.length;

        doc.setFontSize(10);
        doc.text(`• Total de registros: ${registros.length}`, 20, 85);
        doc.text(`• Média de sono: ${mediaSono.toFixed(1)} horas`, 20, 95);
        doc.text(`• Média de estresse: ${mediaEstresse.toFixed(1)}/10`, 20, 105);
        doc.text(`• Média de atividade física: ${mediaAtividade.toFixed(0)} minutos`, 20, 115);
    }

    // Salvar PDF
    doc.save('relatorio-equilibrar.pdf');
            // Relatório PDF gerado silenciosamente
}

// Gerar relatório simples
function gerarRelatorioSimples() {
    const conteudo = `
Relatório Simples - Equilibrar
Data: ${new Date().toLocaleDateString('pt-BR')}
Paciente: ${usuarioAtual ? usuarioAtual.nome : 'Usuário'}

Estatísticas:
- Total de registros: ${registros.length}
- Metas ativas: ${metas.filter(m => !m.completa).length}
- Metas completadas: ${metas.filter(m => m.completa).length}
    `;

    const blob = new Blob([conteudo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio-simples.txt';
    a.click();
    URL.revokeObjectURL(url);

            // Relatório simples gerado silenciosamente
}

// Exportar dados
function exportarDados() {
    const dados = {
        registros: registros,
        metas: metas,
        perfil: perfil,
        dataExportacao: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dados-equilibrar.json';
    a.click();
    URL.revokeObjectURL(url);

            // Dados exportados silenciosamente
}

// Processar feedback
function processarFeedback(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const feedback = {
        tipo: formData.get('feedbackTipo'),
        mensagem: formData.get('feedbackMsg'),
        rating: formData.get('rating'),
        data: new Date().toISOString()
    };

    // Aqui você poderia enviar o feedback para um servidor
    console.log('Feedback enviado:', feedback);
    
            // Feedback enviado silenciosamente
    e.target.reset();
}

// Mostrar notificação
function mostrarNotificacao(mensagem, tipo = 'info') {
    const notifications = document.getElementById('notifications');
    if (!notifications) return;

    const notification = document.createElement('div');
    notification.className = `notification ${tipo}`;
    notification.textContent = mensagem;

    notifications.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Formatar data
function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}

// Calcular streak
function calcularStreak() {
    if (registros.length === 0) return 0;

    let streak = 0;
    const hoje = new Date();
    const registrosOrdenados = [...registros].sort((a, b) => new Date(b.data) - new Date(a.data));

    for (let i = 0; i < registrosOrdenados.length; i++) {
        const dataRegistro = new Date(registrosOrdenados[i].data);
        const dataEsperada = new Date(hoje);
        dataEsperada.setDate(hoje.getDate() - i);

        if (dataRegistro.toDateString() === dataEsperada.toDateString()) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}

// Scroll para seção
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Logout
function logout() {
    localStorage.removeItem('equilibrar_usuario_atual');
    window.location.href = 'login.html';
}

// Sistema de backup automático
function criarBackupAutomatico() {
    const dados = {
        registros: registros,
        metas: metas,
        perfil: perfil,
        dataBackup: new Date().toISOString(),
        versao: '1.0'
    };
    
    localStorage.setItem('equilibrar_backup', JSON.stringify(dados));
    
    const backups = JSON.parse(localStorage.getItem('equilibrar_backups') || '[]');
    backups.push(dados);
    
    if (backups.length > 5) {
        backups.shift();
    }
    
    localStorage.setItem('equilibrar_backups', JSON.stringify(backups));
}

// Restaurar backup
function restaurarBackup() {
    const backup = localStorage.getItem('equilibrar_backup');
    if (backup) {
        try {
            const dados = JSON.parse(backup);
            registros = dados.registros || [];
            metas = dados.metas || [];
            perfil = dados.perfil || {};
            
            salvarDados();
            atualizarDashboard();
            carregarHistorico();
            carregarMetas();
            atualizarGraficos();
            gerarDicas();
            
            // Backup restaurado silenciosamente
        } catch (error) {
            mostrarNotificacao('Erro ao restaurar backup', 'error');
        }
    } else {
        mostrarNotificacao('Nenhum backup encontrado', 'warning');
    }
}

// Sistema de temas
function alternarTema() {
    const body = document.body;
    const temaAtual = localStorage.getItem('equilibrar_tema') || 'claro';
    const novoTema = temaAtual === 'claro' ? 'escuro' : 'claro';
    
    body.classList.toggle('tema-escuro');
    localStorage.setItem('equilibrar_tema', novoTema);
    
            // Tema alterado silenciosamente
}

// Carregar tema salvo
function carregarTema() {
    const tema = localStorage.getItem('equilibrar_tema') || 'claro';
    if (tema === 'escuro') {
        document.body.classList.add('tema-escuro');
    }
}

// Melhorar sistema de notificações
function mostrarNotificacao(mensagem, tipo = 'info', duracao = 4000) {
    const notifications = document.getElementById('notifications');
    if (!notifications) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${tipo}`;
    
    const icones = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="${icones[tipo] || icones.info}"></i>
        <span>${mensagem}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notifications.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, duracao);
} 

// Função de navegação global
function navegarPara(section) {
    // Esconder todas as seções
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    // Mostrar a seção selecionada
    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.display = 'block';
    }
    
    // Atualizar navegação ativa
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const activeLink = document.querySelector(`[data-section="${section}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Fechar sidebar em dispositivos móveis
    const sidebar = document.querySelector('.sidebar');
    if (sidebar && window.innerWidth <= 1024) {
        sidebar.classList.remove('open');
    }
}

// Registrar humor
function registrarHumor() {
    const humorSelecionado = document.querySelector('.humor-option.selected');
    const escalaHumor = document.getElementById('humor-scale').value;
    const observacoes = document.getElementById('humor-notes').value;
    
    if (!humorSelecionado) {
        mostrarNotificacao('Por favor, selecione um humor', 'warning');
        return;
    }
    
    const humor = {
        id: Date.now(),
        tipo: humorSelecionado.dataset.humor,
        valor: parseInt(escalaHumor),
        observacoes: observacoes,
        data: new Date().toISOString(),
        timestamp: new Date().toISOString()
    };
    
    // Salvar no localStorage
    const humoresSalvos = JSON.parse(localStorage.getItem('equilibrar_humores') || '[]');
    humoresSalvos.push(humor);
    localStorage.setItem('equilibrar_humores', JSON.stringify(humoresSalvos));
    
    // Atualizar dashboard
    atualizarHumorAtual(humor);
    atualizarHistoricoHumor();
    atualizarGraficoHumor();
    
    // Limpar formulário
    document.querySelectorAll('.humor-option').forEach(option => option.classList.remove('selected'));
    document.getElementById('humor-scale').value = 7;
    document.getElementById('scale-value').textContent = '7';
    document.getElementById('humor-notes').value = '';
    
            // Humor registrado silenciosamente
    
    // Navegar para dashboard
    setTimeout(() => {
        navegarPara('dashboard');
    }, 1500);
}

// Atualizar humor atual no dashboard
function atualizarHumorAtual(humor) {
    const humorAtualElement = document.getElementById('humor-atual');
    if (humorAtualElement) {
        const emojis = {
            'feliz': '😊',
            'calmo': '😌',
            'neutro': '😐',
            'triste': '😔',
            'ansioso': '😰',
            'irritado': '😤'
        };
        
        const emoji = emojis[humor.tipo] || '😐';
        humorAtualElement.textContent = `${emoji} ${humor.tipo.charAt(0).toUpperCase() + humor.tipo.slice(1)}`;
    }
}

// Atualizar histórico de humor
function atualizarHistoricoHumor() {
    const historyList = document.querySelector('.history-list');
    if (!historyList) return;
    
    const humoresSalvos = JSON.parse(localStorage.getItem('equilibrar_humores') || '[]');
    const ultimosHumores = humoresSalvos.slice(-5).reverse();
    
    historyList.innerHTML = '';
    
    ultimosHumores.forEach(humor => {
        const emojis = {
            'feliz': '😊',
            'calmo': '😌',
            'neutro': '😐',
            'triste': '😔',
            'ansioso': '😰',
            'irritado': '😤'
        };
        
        const emoji = emojis[humor.tipo] || '😐';
        const data = new Date(humor.data);
        const hoje = new Date();
        const ontem = new Date(hoje);
        ontem.setDate(hoje.getDate() - 1);
        
        let dataTexto;
        if (data.toDateString() === hoje.toDateString()) {
            dataTexto = 'Hoje';
        } else if (data.toDateString() === ontem.toDateString()) {
            dataTexto = 'Ontem';
        } else {
            dataTexto = data.toLocaleDateString('pt-BR');
        }
        
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <div class="history-date">${dataTexto}</div>
            <div class="history-humor">${emoji} ${humor.tipo.charAt(0).toUpperCase() + humor.tipo.slice(1)} (${humor.valor}/10)</div>
            <div class="history-time">${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
        `;
        historyList.appendChild(item);
    });
}

// Atualizar gráfico de humor
function atualizarGraficoHumor() {
    const canvas = document.getElementById('humor-chart');
    if (!canvas) return;
    
    const humoresSalvos = JSON.parse(localStorage.getItem('equilibrar_humores') || '[]');
    const ultimos7Dias = humoresSalvos.slice(-7);
    
    if (ultimos7Dias.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destruir gráfico existente se houver
    if (window.humorChart) {
        window.humorChart.destroy();
    }
    
    const labels = ultimos7Dias.map(humor => {
        const data = new Date(humor.data);
        return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    });
    
    const valores = ultimos7Dias.map(humor => humor.valor);
    
    window.humorChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Humor (1-10)',
                data: valores,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    min: 1,
                    max: 10,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Inicializar eventos de humor
function inicializarEventosHumor() {
    // Seleção de humor
    const humorOptions = document.querySelectorAll('.humor-option');
    humorOptions.forEach(option => {
        option.addEventListener('click', function() {
            humorOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Slider de escala
    const humorScale = document.getElementById('humor-scale');
    const scaleValue = document.getElementById('scale-value');
    if (humorScale && scaleValue) {
        humorScale.addEventListener('input', function() {
            scaleValue.textContent = this.value;
        });
    }
}

// Atualizar dashboard com dados reais
function atualizarDashboardReal() {
    const humoresSalvos = JSON.parse(localStorage.getItem('equilibrar_humores') || '[]');
    
    if (humoresSalvos.length > 0) {
        const ultimoHumor = humoresSalvos[humoresSalvos.length - 1];
        
        // Atualizar humor atual
        const humorAtualElement = document.getElementById('humor-atual');
        if (humorAtualElement) {
            const emojis = {
                'feliz': '😊',
                'calmo': '😌',
                'neutro': '😐',
                'triste': '😔',
                'ansioso': '😰',
                'irritado': '😤'
            };
            
            const emoji = emojis[ultimoHumor.tipo] || '😐';
            humorAtualElement.textContent = `${emoji} ${ultimoHumor.tipo.charAt(0).toUpperCase() + ultimoHumor.tipo.slice(1)}`;
        }
        
        // Atualizar próxima sessão
        const sessoesSalvas = JSON.parse(localStorage.getItem('equilibrar_sessoes') || '[]');
        const proximaSessao = sessoesSalvas.find(sessao => 
            sessao.pacienteId === 'maria_silva' && new Date(sessao.data) > new Date()
        );
        
        const proximaSessaoElement = document.getElementById('proxima-sessao');
        if (proximaSessao && proximaSessaoElement) {
            const dataSessao = new Date(proximaSessao.data);
            proximaSessaoElement.textContent = dataSessao.toLocaleDateString('pt-BR') + ' - ' + 
                                              dataSessao.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        }
        
        // Atualizar dias consecutivos
        const diasConsecutivos = calcularDiasConsecutivos(humoresSalvos);
        const diasConsecutivosElement = document.getElementById('dias-consecutivos');
        if (diasConsecutivosElement) {
            diasConsecutivosElement.textContent = diasConsecutivos;
        }
        
        // Atualizar conquistas
        const conquistas = calcularConquistas(humoresSalvos);
        const conquistasElement = document.getElementById('conquistas');
        if (conquistasElement) {
            conquistasElement.textContent = conquistas;
        }
    }
}

// Carregar dados iniciais
function carregarDadosIniciais() {
    // Carregar humor atual
    const humoresSalvos = JSON.parse(localStorage.getItem('equilibrar_humores') || '[]');
    if (humoresSalvos.length > 0) {
        const ultimoHumor = humoresSalvos[humoresSalvos.length - 1];
        atualizarHumorAtual(ultimoHumor);
    }
    
    // Atualizar dashboard real
    atualizarDashboardReal();
    
    // Carregar histórico
    atualizarHistoricoHumor();
    
    // Carregar gráfico
    atualizarGraficoHumor();
    
    // Carregar sessões
    carregarSessoesPaciente();
    
    // Carregar progresso
    carregarProgressoPaciente();
    
    // Carregar recursos
    carregarRecursosPaciente();
    
    // Carregar perfil
    carregarPerfilPaciente();
    
    // Carregar configurações
    carregarConfiguracoesPaciente();
}

// Carregar sessões do paciente
function carregarSessoesPaciente() {
    const sessoesSalvas = JSON.parse(localStorage.getItem('equilibrar_sessoes') || '[]');
    const sessoesPaciente = sessoesSalvas.filter(sessao => sessao.pacienteId === 'maria_silva');
    
    // Atualizar próxima sessão
    const proximaSessao = sessoesPaciente.find(sessao => new Date(sessao.data) > new Date());
    if (proximaSessao) {
        const dataSessao = new Date(proximaSessao.data);
        const proximaSessaoElement = document.getElementById('proxima-sessao');
        if (proximaSessaoElement) {
            proximaSessaoElement.textContent = dataSessao.toLocaleDateString('pt-BR') + ' - ' + 
                                              dataSessao.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        }
    }
}

// Carregar progresso do paciente
function carregarProgressoPaciente() {
    const humoresSalvos = JSON.parse(localStorage.getItem('equilibrar_humores') || '[]');
    
    // Calcular dias consecutivos
    const diasConsecutivos = calcularDiasConsecutivos(humoresSalvos);
    const diasConsecutivosElement = document.getElementById('dias-consecutivos');
    if (diasConsecutivosElement) {
        diasConsecutivosElement.textContent = diasConsecutivos;
    }
    
    // Calcular conquistas
    const conquistas = calcularConquistas(humoresSalvos);
    const conquistasElement = document.getElementById('conquistas');
    if (conquistasElement) {
        conquistasElement.textContent = conquistas;
    }
}

// Calcular dias consecutivos
function calcularDiasConsecutivos(humores) {
    if (humores.length === 0) return 0;
    
    let diasConsecutivos = 0;
    const hoje = new Date();
    const registrosPorDia = {};
    
    // Agrupar registros por dia
    humores.forEach(humor => {
        const data = new Date(humor.data).toDateString();
        if (!registrosPorDia[data]) {
            registrosPorDia[data] = [];
        }
        registrosPorDia[data].push(humor);
    });
    
    // Calcular sequência
    for (let i = 0; i < 30; i++) {
        const dataVerificar = new Date(hoje);
        dataVerificar.setDate(hoje.getDate() - i);
        const dataString = dataVerificar.toDateString();
        
        if (registrosPorDia[dataString]) {
            diasConsecutivos++;
        } else {
            break;
        }
    }
    
    return diasConsecutivos;
}

// Calcular conquistas
function calcularConquistas(humores) {
    let conquistas = 0;
    
    // Conquista por dias consecutivos
    const diasConsecutivos = calcularDiasConsecutivos(humores);
    if (diasConsecutivos >= 7) conquistas++;
    if (diasConsecutivos >= 30) conquistas++;
    if (diasConsecutivos >= 100) conquistas++;
    
    // Conquista por humor positivo
    const humoresPositivos = humores.filter(h => h.valor >= 7).length;
    if (humoresPositivos >= 10) conquistas++;
    if (humoresPositivos >= 50) conquistas++;
    
    // Conquista por consistência
    if (humores.length >= 10) conquistas++;
    if (humores.length >= 50) conquistas++;
    
    return conquistas;
}

// Carregar recursos do paciente
function carregarRecursosPaciente() {
    // Esta função pode ser expandida para carregar recursos específicos do paciente
    // Por enquanto, os recursos estão estáticos no HTML
}

// Carregar perfil do paciente
function carregarPerfilPaciente() {
    const perfilSalvo = localStorage.getItem('equilibrar_perfil_paciente');
    if (perfilSalvo) {
        const perfil = JSON.parse(perfilSalvo);
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = perfil.nome || 'Maria Silva';
        }
    }
}

// Carregar configurações do paciente


// Carregar dados de exemplo se não houver dados salvos
function carregarDadosExemplo() {
    // Verificar se já existem dados salvos
    const humoresSalvos = localStorage.getItem('equilibrar_humores');
    if (!humoresSalvos || JSON.parse(humoresSalvos).length === 0) {
        // Criar dados de exemplo
        const dadosExemplo = [
            {
                id: Date.now() - 86400000, // Ontem
                tipo: 'feliz',
                valor: 8,
                observacoes: 'Dia muito produtivo no trabalho',
                data: new Date(Date.now() - 86400000).toISOString(),
                timestamp: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: Date.now() - 172800000, // Há 2 dias
                tipo: 'calmo',
                valor: 7,
                observacoes: 'Sessão de terapia muito boa',
                data: new Date(Date.now() - 172800000).toISOString(),
                timestamp: new Date(Date.now() - 172800000).toISOString()
            },
            {
                id: Date.now() - 259200000, // Há 3 dias
                tipo: 'neutro',
                valor: 5,
                observacoes: 'Dia normal, sem grandes acontecimentos',
                data: new Date(Date.now() - 259200000).toISOString(),
                timestamp: new Date(Date.now() - 259200000).toISOString()
            },
            {
                id: Date.now() - 345600000, // Há 4 dias
                tipo: 'feliz',
                valor: 9,
                observacoes: 'Encontrei com amigos, foi muito divertido',
                data: new Date(Date.now() - 345600000).toISOString(),
                timestamp: new Date(Date.now() - 345600000).toISOString()
            },
            {
                id: Date.now() - 432000000, // Há 5 dias
                tipo: 'ansioso',
                valor: 3,
                observacoes: 'Preocupada com uma apresentação no trabalho',
                data: new Date(Date.now() - 432000000).toISOString(),
                timestamp: new Date(Date.now() - 432000000).toISOString()
            },
            {
                id: Date.now() - 518400000, // Há 6 dias
                tipo: 'calmo',
                valor: 6,
                observacoes: 'Dia tranquilo em casa',
                data: new Date(Date.now() - 518400000).toISOString(),
                timestamp: new Date(Date.now() - 518400000).toISOString()
            },
            {
                id: Date.now() - 604800000, // Há 7 dias
                tipo: 'feliz',
                valor: 8,
                observacoes: 'Final de semana relaxante',
                data: new Date(Date.now() - 604800000).toISOString(),
                timestamp: new Date(Date.now() - 604800000).toISOString()
            }
        ];
        
        localStorage.setItem('equilibrar_humores', JSON.stringify(dadosExemplo));
    }
    
    // Verificar se existem sessões salvas
    const sessoesSalvas = localStorage.getItem('equilibrar_sessoes');
    if (!sessoesSalvas || JSON.parse(sessoesSalvas).length === 0) {
        // Criar sessões de exemplo
        const sessoesExemplo = [
            {
                id: 'sessao_1',
                pacienteId: 'maria_silva',
                psicologoId: 'dr_silva',
                data: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Em 2 dias
                duracao: 50,
                tipo: 'online',
                status: 'agendada',
                descricao: 'Sessão regular de acompanhamento'
            },
            {
                id: 'sessao_2',
                pacienteId: 'maria_silva',
                psicologoId: 'dr_silva',
                data: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Há 1 semana
                duracao: 50,
                tipo: 'online',
                status: 'concluida',
                descricao: 'Sessão sobre técnicas de respiração'
            },
            {
                id: 'sessao_3',
                pacienteId: 'maria_silva',
                psicologoId: 'dr_silva',
                data: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // Há 2 semanas
                duracao: 50,
                tipo: 'online',
                status: 'concluida',
                descricao: 'Sessão sobre autoconhecimento'
            }
        ];
        
        localStorage.setItem('equilibrar_sessoes', JSON.stringify(sessoesExemplo));
    }
    
    // Verificar se existe perfil salvo
    const perfilSalvo = localStorage.getItem('equilibrar_perfil_paciente');
    if (!perfilSalvo) {
        const perfilExemplo = {
            nome: 'Maria Silva',
            email: 'maria.silva@email.com',
            telefone: '(11) 91234-5678',
            dataNascimento: '15/03/1996',
            psicologo: 'Dr. Silva',
            objetivo: 'Melhorar o controle da ansiedade e desenvolver técnicas de autoconhecimento'
        };
        
        localStorage.setItem('equilibrar_perfil_paciente', JSON.stringify(perfilExemplo));
    }
    

}

// Inicializar todos os eventos quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Carregar dados de exemplo se necessário
    carregarDadosExemplo();
    
    // Inicializar eventos específicos
    inicializarEventosHumor();
    
    // Carregar dados iniciais
    carregarDadosIniciais();
    
    // Inicializar navegação
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            navegarPara(section);
        });
    });
    
    // Inicializar sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('open');
        });
    }
    
    // Fechar sidebar ao clicar fora (mobile)
    document.addEventListener('click', function(e) {
        const sidebar = document.querySelector('.sidebar');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
    
    // Garantir que o dashboard seja exibido por padrão
    setTimeout(() => {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            navegarPara(hash);
        } else {
            navegarPara('dashboard');
        }
    }, 100);
}); 