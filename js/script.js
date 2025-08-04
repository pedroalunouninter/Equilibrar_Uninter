// Sistema de Notificações
class NotificationSystem {
    constructor() {
        this.container = document.getElementById('notifications');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notifications';
            this.container.className = 'notifications';
            document.body.appendChild(this.container);
        }
    }

    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = this.getIcon(type);
        
        notification.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        this.container.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto-remover
        if (duration > 0) {
            setTimeout(() => {
                this.hide(notification);
            }, duration);
        }
        
        return notification;
    }

    hide(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }

    getIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
}

// Sistema de Navegação
class NavigationSystem {
    constructor() {
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        // Navegação por links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.navigateTo(section);
        });
    });
    
        // Navegação por hash
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            if (hash) {
                this.navigateTo(hash);
            }
        });

        // Navegação inicial
        const hash = window.location.hash.slice(1);
        if (hash) {
            this.navigateTo(hash);
        }
    }

    navigateTo(section) {
        // Esconder todas as seções
        document.querySelectorAll('.section').forEach(s => {
            s.classList.remove('active');
        });

        // Remover classe ativa de todos os links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Mostrar seção selecionada
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = section;
        }

        // Ativar link correspondente
        const activeLink = document.querySelector(`[data-section="${section}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Atualizar hash
        window.location.hash = section;
    }
}

// Sistema de Formulários
class FormSystem {
    constructor() {
        this.init();
    }

    init() {
        // Inicializar formulários
        this.initRangeSliders();
        this.initFormValidation();
        this.initAutoSave();
    }

    initRangeSliders() {
        document.querySelectorAll('.range-slider').forEach(slider => {
            const valueDisplay = document.getElementById(slider.id + '-valor');
            
            slider.addEventListener('input', (e) => {
                if (valueDisplay) {
                    valueDisplay.textContent = e.target.value;
                }
            });
        });
    }

    initFormValidation() {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
        });
    });
}

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'Este campo é obrigatório');
                isValid = false;
    } else {
                this.clearFieldError(field);
            }
        });

        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = 'var(--danger)';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '4px';
        
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = 'var(--danger)';
    }

    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '';
    }

    initAutoSave() {
        const forms = document.querySelectorAll('form[data-autosave]');
        forms.forEach(form => {
            const fields = form.querySelectorAll('input, select, textarea');
            fields.forEach(field => {
                field.addEventListener('change', () => {
                    this.saveFormData(form);
                });
            });
        });
    }

    saveFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        localStorage.setItem(`form_${form.id}`, JSON.stringify(data));
    }

    loadFormData(form) {
        const saved = localStorage.getItem(`form_${form.id}`);
        if (saved) {
            const data = JSON.parse(saved);
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field) {
                    field.value = data[key];
                }
            });
        }
    }
}

// Sistema de Dados
class DataSystem {
    constructor() {
        this.storageKey = 'equilibrar_data';
        this.data = this.loadData();
    }

    loadData() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : {
            pacientes: [],
            psicologos: [],
            registros: [],
            sessoes: [],
            metas: [],
            notas: []
        };
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    // Métodos para pacientes
    addPaciente(paciente) {
        paciente.id = this.generateId();
        paciente.createdAt = new Date().toISOString();
        this.data.pacientes.push(paciente);
        this.saveData();
        return paciente;
    }

    getPacientes() {
        return this.data.pacientes;
    }

    getPaciente(id) {
        return this.data.pacientes.find(p => p.id === id);
    }

    updatePaciente(id, updates) {
        const index = this.data.pacientes.findIndex(p => p.id === id);
        if (index !== -1) {
            this.data.pacientes[index] = { ...this.data.pacientes[index], ...updates };
            this.saveData();
            return this.data.pacientes[index];
        }
        return null;
    }

    // Métodos para registros
    addRegistro(registro) {
        registro.id = this.generateId();
        registro.createdAt = new Date().toISOString();
        this.data.registros.push(registro);
        this.saveData();
        return registro;
    }

    getRegistros(pacienteId = null) {
        if (pacienteId) {
            return this.data.registros.filter(r => r.pacienteId === pacienteId);
        }
        return this.data.registros;
    }

    // Métodos para metas
    addMeta(meta) {
        meta.id = this.generateId();
        meta.createdAt = new Date().toISOString();
        meta.progress = 0;
        this.data.metas.push(meta);
        this.saveData();
        return meta;
    }

    getMetas(pacienteId = null) {
        if (pacienteId) {
            return this.data.metas.filter(m => m.pacienteId === pacienteId);
        }
        return this.data.metas;
    }

    updateMetaProgress(id, progress) {
        const meta = this.data.metas.find(m => m.id === id);
        if (meta) {
            meta.progress = Math.min(100, Math.max(0, progress));
            this.saveData();
            return meta;
        }
        return null;
    }

    // Métodos para sessões
    addSessao(sessao) {
        sessao.id = this.generateId();
        sessao.createdAt = new Date().toISOString();
        this.data.sessoes.push(sessao);
        this.saveData();
        return sessao;
    }

    getSessoes(psicologoId = null) {
        if (psicologoId) {
            return this.data.sessoes.filter(s => s.psicologoId === psicologoId);
        }
        return this.data.sessoes;
    }

    // Utilitários
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Estatísticas
    getEstatisticas(pacienteId) {
        const registros = this.getRegistros(pacienteId);
        const metas = this.getMetas(pacienteId);
        
        return {
            totalRegistros: registros.length,
            registrosEstaSemana: this.getRegistrosEstaSemana(registros),
            metasConcluidas: metas.filter(m => m.progress >= 100).length,
            totalMetas: metas.length,
            diasConsecutivos: this.getDiasConsecutivos(registros)
        };
    }

    getRegistrosEstaSemana(registros) {
        const umaSemanaAtras = new Date();
        umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);
        
        return registros.filter(r => new Date(r.createdAt) >= umaSemanaAtras).length;
    }

    getDiasConsecutivos(registros) {
        if (registros.length === 0) return 0;
        
        const datas = registros
            .map(r => new Date(r.createdAt).toDateString())
            .filter((date, index, arr) => arr.indexOf(date) === index)
            .sort();
        
        let consecutivos = 1;
        let maxConsecutivos = 1;
        
        for (let i = 1; i < datas.length; i++) {
            const dataAtual = new Date(datas[i]);
            const dataAnterior = new Date(datas[i - 1]);
            const diffDias = (dataAtual - dataAnterior) / (1000 * 60 * 60 * 24);
            
            if (diffDias === 1) {
                consecutivos++;
                maxConsecutivos = Math.max(maxConsecutivos, consecutivos);
        } else {
                consecutivos = 1;
            }
        }
        
        return maxConsecutivos;
    }
}

// Sistema de Autenticação
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Verificar se há usuário logado
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUI();
        }
    }

    login(credentials) {
        // Simular autenticação
        const users = [
            { id: '1', nome: 'João Silva', email: 'joao@email.com', senha: '123456', tipo: 'paciente' },
            { id: '2', nome: 'Maria Santos', email: 'maria@email.com', senha: '123456', tipo: 'psicologo' }
        ];

        const user = users.find(u => 
            u.email === credentials.email && u.senha === credentials.senha
        );

        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.updateUI();
            return { success: true, user };
        } else {
            return { success: false, message: 'Credenciais inválidas' };
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }

    updateUI() {
        const userNameElement = document.getElementById('user-name');
        if (userNameElement && this.currentUser) {
            userNameElement.textContent = this.currentUser.nome;
        }
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Sistema de Gráficos
class ChartSystem {
    constructor() {
        this.charts = new Map();
    }

    createChart(containerId, type, data, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return null;

        // Simular criação de gráfico
        const chartId = `chart_${Date.now()}`;
        const chartElement = document.createElement('div');
        chartElement.id = chartId;
        chartElement.className = 'chart-container';
        chartElement.style.height = '300px';
        chartElement.style.background = 'var(--secondary)';
        chartElement.style.borderRadius = '8px';
        chartElement.style.display = 'flex';
        chartElement.style.alignItems = 'center';
        chartElement.style.justifyContent = 'center';
        chartElement.style.color = 'var(--text-light)';
        chartElement.innerHTML = `
            <div style="text-align: center;">
                <i class="fas fa-chart-${type}" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                <p>Gráfico ${type} será renderizado aqui</p>
                <small>Dados: ${JSON.stringify(data).slice(0, 50)}...</small>
            </div>
        `;

        container.appendChild(chartElement);
        this.charts.set(chartId, { type, data, options });
        
        return chartId;
    }

    updateChart(chartId, newData) {
        const chart = this.charts.get(chartId);
        if (chart) {
            chart.data = newData;
            // Aqui você implementaria a atualização real do gráfico
        }
    }

    destroyChart(chartId) {
        const chartElement = document.getElementById(chartId);
        if (chartElement) {
            chartElement.remove();
        }
        this.charts.delete(chartId);
    }
}

// Sistema Principal
class EquilibrarApp {
    constructor() {
        this.notifications = new NotificationSystem();
        this.navigation = new NavigationSystem();
        this.forms = new FormSystem();
        this.data = new DataSystem();
        this.auth = new AuthSystem();
        this.charts = new ChartSystem();
        
        this.init();
    }

    init() {
        // Verificar autenticação apenas se não estiver na página de login
        if (!this.auth.isAuthenticated() && !window.location.href.includes('index.html')) {
            // Permitir acesso direto às páginas para demonstração
            // window.location.href = 'index.html';
            // return;
        }

        // Inicializar funcionalidades específicas da página
        this.initPageSpecific();
        
        // Configurar eventos globais
        this.setupGlobalEvents();
        
        // Carregar dados iniciais
        this.loadInitialData();
    }

    initPageSpecific() {
        const currentPage = this.getCurrentPage();
        
        switch (currentPage) {
            case 'paciente':
                this.initPacientePage();
                break;
            case 'psicologo':
                this.initPsicologoPage();
                break;
            case 'login':
                this.initLoginPage();
                break;
        }
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('paciente.html')) return 'paciente';
        if (path.includes('psicologo.html')) return 'psicologo';
        if (path.includes('index.html')) return 'login';
        return 'dashboard';
    }

    initPacientePage() {
        this.loadDashboardData();
        this.setupPacienteEvents();
    }

    initPsicologoPage() {
        this.loadPsicologoDashboard();
        this.setupPsicologoEvents();
    }

    initLoginPage() {
        this.setupLoginEvents();
    }

    setupGlobalEvents() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                document.querySelector('.sidebar').classList.toggle('open');
            });
        }

        // Logout
        const logoutButtons = document.querySelectorAll('[onclick*="logout"]');
        logoutButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.auth.logout();
            });
        });

        // Navegação por função
        window.navegarPara = (section) => {
            this.navigation.navigateTo(section);
        };
    }

    setupPacienteEvents() {
        // Formulário de registro
        const registroForm = document.getElementById('registro-form');
        if (registroForm) {
            registroForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistroSubmit(e.target);
            });
        }

        // Filtros de histórico
        const filtroPeriodo = document.getElementById('filtro-periodo');
        const filtroTipo = document.getElementById('filtro-tipo');
        
        if (filtroPeriodo) {
            filtroPeriodo.addEventListener('change', () => this.loadHistorico());
        }
        if (filtroTipo) {
            filtroTipo.addEventListener('change', () => this.loadHistorico());
        }
    }

    setupPsicologoEvents() {
        // Busca de pacientes
        const searchInput = document.getElementById('search-pacientes');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchPacientes(e.target.value);
            });
        }

        // Filtros de sessões
        const filtroSessoes = document.getElementById('filtro-sessoes');
        if (filtroSessoes) {
            filtroSessoes.addEventListener('change', () => this.loadSessoes());
        }
    }

    setupLoginEvents() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLoginSubmit(e.target);
            });
        }

        // Toggle de senha
        const passwordToggle = document.querySelector('.password-toggle');
        if (passwordToggle) {
            passwordToggle.addEventListener('click', () => {
                const passwordInput = document.querySelector('.password-input');
                const icon = passwordToggle.querySelector('i');
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                } else {
                    passwordInput.type = 'password';
                    icon.className = 'fas fa-eye';
            }
        });
    }
}

    handleLoginSubmit(form) {
        const formData = new FormData(form);
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        // Credenciais de demonstração
        const validCredentials = {
            'paciente': { tipo: 'paciente', nome: 'Maria Silva', email: 'paciente@equilibrar.com' },
            'psicologo': { tipo: 'psicologo', nome: 'Dr. Silva', email: 'psicologo@equilibrar.com' }
        };

        const user = validCredentials[credentials.username];
        
        if (user && credentials.password === '123456') {
            // Login bem-sucedido
            const userData = {
                id: credentials.username,
                nome: user.nome,
                email: user.email,
                tipo: user.tipo
            };
            
            localStorage.setItem('equilibrar_usuario_atual', JSON.stringify(userData));
            
            // Mostrar feedback visual
            const loginBtn = form.querySelector('.login-btn');
            const originalText = loginBtn.innerHTML;
            loginBtn.innerHTML = '<i class="fas fa-check"></i> <span>Entrando...</span>';
            loginBtn.disabled = true;
            
            // Redirecionar após um breve delay
            setTimeout(() => {
                if (user.tipo === 'paciente') {
                    window.location.href = 'paciente.html';
                } else {
                    window.location.href = 'psicologo.html';
                }
            }, 1500);
        } else {
            // Login falhou
            const errorElement = document.getElementById('login-error');
            errorElement.style.display = 'flex';
            
            // Limpar campos
            form.reset();
            
            // Focar no primeiro campo
            document.getElementById('username').focus();
            
            // Esconder erro após 5 segundos
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 5000);
        }
    }

    handleRegistroSubmit(form) {
        const formData = new FormData(form);
        const registro = {
            pacienteId: this.auth.getCurrentUser().id,
            data: formData.get('data'),
            hora: formData.get('hora'),
            humor: formData.get('humor'),
            energia: parseInt(formData.get('energia')),
            ansiedade: parseInt(formData.get('ansiedade')),
            sono: parseInt(formData.get('sono')),
            atividades: formData.getAll('atividades'),
            sintomas: formData.getAll('sintomas'),
            medicamentos: formData.get('medicamentos'),
            observacoes: formData.get('observacoes')
        };

        this.data.addRegistro(registro);
        this.notifications.success('Registro salvo com sucesso!');
        form.reset();
        
        // Atualizar dashboard
        this.loadDashboardData();
    }

    loadDashboardData() {
        const user = this.auth.getCurrentUser();
        // Permitir carregamento mesmo sem usuário autenticado para demonstração
        
        if (user) {
            const stats = this.data.getEstatisticas(user.id);
            
            // Só atualizar cards se houver dados dinâmicos
            if (stats.totalRegistros > 0) {
                this.updateDashboardCard('bem-estar-valor', `${Math.round((stats.totalRegistros / 30) * 100)}%`);
                this.updateDashboardCard('registros-semana', stats.registrosEstaSemana);
                this.updateDashboardCard('metas-alcancadas', `${stats.metasConcluidas}/${stats.totalMetas}`);
                this.updateDashboardCard('proxima-sessao', '15/12');
            }
        }
        
        // Carregar histórico
        this.loadHistorico();
        
        // Carregar metas
        this.loadMetas();
    }

    loadPsicologoDashboard() {
        const user = this.auth.getCurrentUser();
        // Permitir carregamento mesmo sem usuário autenticado para demonstração
        
        const pacientes = this.data.getPacientes();
        const sessoes = user ? this.data.getSessoes(user.id) : [];
        
        // Só atualizar cards se houver dados dinâmicos
        if (pacientes.length > 0) {
            this.updateDashboardCard('total-pacientes', pacientes.length);
            this.updateDashboardCard('sessoes-hoje', sessoes.filter(s => 
                new Date(s.data).toDateString() === new Date().toDateString()
            ).length);
            this.updateDashboardCard('pacientes-ativos', pacientes.filter(p => p.status === 'ativo').length);
            this.updateDashboardCard('alertas', '2');
        }
        
        // Carregar pacientes
        this.loadPacientes();
        
        // Carregar sessões
        this.loadSessoes();
    }

    updateDashboardCard(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    loadHistorico() {
        const user = this.auth.getCurrentUser();
        // Permitir carregamento mesmo sem usuário autenticado para demonstração
        
        const registros = user ? this.data.getRegistros(user.id) : [];
        const container = document.getElementById('historico-lista');
        
        if (!container) return;

        // Só limpar o conteúdo se houver registros dinâmicos suficientes
        if (registros.length > 0) {
            container.innerHTML = '';
            
            registros.slice(0, 10).forEach(registro => {
                const item = this.createHistoricoItem(registro);
                container.appendChild(item);
            });
        }
        // Se não houver registros, manter o conteúdo estático do HTML
    }

    createHistoricoItem(registro) {
        const item = document.createElement('div');
        item.className = 'historico-item';
        
        const data = new Date(registro.data + 'T' + registro.hora);
        
        item.innerHTML = `
            <div class="historico-header">
                <div class="historico-data">${data.toLocaleDateString('pt-BR')} às ${data.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}</div>
            </div>
            <div class="historico-stats">
                <div class="historico-stat">
                    <span>${registro.humor}</span>
                    <span>Humor</span>
                </div>
                <div class="historico-stat">
                    <span>${registro.energia}/10</span>
                    <span>Energia</span>
                </div>
                <div class="historico-stat">
                    <span>${registro.ansiedade}/10</span>
                    <span>Ansiedade</span>
                </div>
            </div>
            ${registro.observacoes ? `<div class="historico-observacoes">${registro.observacoes}</div>` : ''}
        `;
        
        return item;
    }

    loadMetas() {
        const user = this.auth.getCurrentUser();
        // Permitir carregamento mesmo sem usuário autenticado para demonstração
        
        const metas = user ? this.data.getMetas(user.id) : [];
        const container = document.getElementById('metas-lista');
        
        if (!container) return;

        // Só limpar o conteúdo se houver metas dinâmicas suficientes
    if (metas.length > 0) {
            container.innerHTML = '';

        metas.forEach(meta => {
                const item = this.createMetaItem(meta);
                container.appendChild(item);
            });
        }
        // Se não houver metas, manter o conteúdo estático do HTML
    }

    createMetaItem(meta) {
        const item = document.createElement('div');
        item.className = 'meta-item';
        
        item.innerHTML = `
            <div class="meta-header">
                <div class="meta-titulo">${meta.titulo}</div>
                <div class="meta-tipo">${meta.tipo}</div>
            </div>
            <div class="meta-progresso">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${meta.progress}%"></div>
                </div>
            </div>
            <div class="meta-stats">
                <span>${meta.progress}% concluído</span>
                <span>Prazo: ${new Date(meta.prazo).toLocaleDateString('pt-BR')}</span>
            </div>
        `;
        
        return item;
    }

    loadPacientes() {
        const pacientes = this.data.getPacientes();
        const container = document.getElementById('pacientes-grid');
        
        if (!container) return;

        // Só limpar o conteúdo se houver pacientes dinâmicos suficientes
        if (pacientes.length > 0) {
            container.innerHTML = '';
            
            pacientes.forEach(paciente => {
                const card = this.createPacienteCard(paciente);
                container.appendChild(card);
            });
        }
        // Se não houver pacientes, manter o conteúdo estático do HTML
    }

    createPacienteCard(paciente) {
        const card = document.createElement('div');
        card.className = 'paciente-card';
        
        card.innerHTML = `
            <div class="paciente-header">
                <i class="fas fa-user"></i>
                <h4>${paciente.nome}</h4>
                <div class="paciente-status ativo">Ativo</div>
            </div>
            <div class="paciente-info">
                <p><i class="fas fa-envelope"></i> ${paciente.email}</p>
                <p><i class="fas fa-phone"></i> ${paciente.telefone}</p>
            </div>
            <div class="paciente-motivo">
                <strong>Motivo:</strong> ${paciente.motivo}
            </div>
            <div class="paciente-actions">
                <button class="btn btn-primary" onclick="app.verPaciente('${paciente.id}')">
                    <i class="fas fa-eye"></i> Ver Detalhes
                </button>
            </div>
        `;
        
        return card;
    }

    loadSessoes() {
        const user = this.auth.getCurrentUser();
        // Permitir carregamento mesmo sem usuário autenticado para demonstração
        
        const sessoes = user ? this.data.getSessoes(user.id) : [];
        const container = document.getElementById('sessoes-lista');
        
        if (!container) return;

        // Só limpar o conteúdo se houver sessões dinâmicas suficientes
        if (sessoes.length > 0) {
            container.innerHTML = '';
            
            sessoes.slice(0, 10).forEach(sessao => {
                const item = this.createSessaoItem(sessao);
                container.appendChild(item);
            });
        }
        // Se não houver sessões, manter o conteúdo estático do HTML
    }

    createSessaoItem(sessao) {
        const item = document.createElement('div');
        item.className = `sessao-item ${sessao.status}`;
        
        const data = new Date(sessao.data + 'T' + sessao.hora);
        
        item.innerHTML = `
            <div class="sessao-header">
                <h4>Sessão com ${sessao.pacienteNome}</h4>
                <div class="sessao-status ${sessao.status}">${sessao.status}</div>
            </div>
            <div class="sessao-info">
                <p><i class="fas fa-calendar"></i> ${data.toLocaleDateString('pt-BR')}</p>
                <p><i class="fas fa-clock"></i> ${data.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}</p>
                <p><i class="fas fa-user"></i> ${sessao.pacienteNome}</p>
            </div>
            ${sessao.observacoes ? `<div class="sessao-observacoes">${sessao.observacoes}</div>` : ''}
        `;
        
        return item;
    }

    searchPacientes(query) {
        const pacientes = this.data.getPacientes();
        const filtered = pacientes.filter(p => 
            p.nome.toLowerCase().includes(query.toLowerCase()) ||
            p.email.toLowerCase().includes(query.toLowerCase())
        );
        
        const container = document.getElementById('pacientes-grid');
        if (!container) return;

        // Só limpar o conteúdo se houver resultados de busca
        if (filtered.length > 0) {
            container.innerHTML = '';
            
            filtered.forEach(paciente => {
                const card = this.createPacienteCard(paciente);
                container.appendChild(card);
            });
        } else if (query.trim() === '') {
            // Se a busca estiver vazia, manter o conteúdo estático original
            // Não fazer nada, deixar o conteúdo HTML original
    } else {
            // Se houver busca mas não encontrar resultados, mostrar mensagem
            container.innerHTML = '<div class="no-results">Nenhum paciente encontrado com esses critérios.</div>';
        }
    }

    loadInitialData() {
        // Não carregar dados de exemplo automaticamente
        // Permitir que o conteúdo estático do HTML seja exibido
        // this.loadSampleData();
    }

    loadSampleData() {
        // Adicionar pacientes de exemplo
        this.data.addPaciente({
            nome: 'João Silva',
            email: 'joao@email.com',
            telefone: '(11) 99999-9999',
            motivo: 'Ansiedade e estresse no trabalho',
            status: 'ativo'
        });

        this.data.addPaciente({
            nome: 'Maria Santos',
            email: 'maria@email.com',
            telefone: '(11) 88888-8888',
            motivo: 'Depressão e baixa autoestima',
            status: 'ativo'
        });

        // Adicionar registros de exemplo
        const hoje = new Date();
        for (let i = 0; i < 7; i++) {
            const data = new Date(hoje);
            data.setDate(data.getDate() - i);
            
            this.data.addRegistro({
                pacienteId: '1',
                data: data.toISOString().split('T')[0],
                hora: '09:00',
                humor: 'feliz',
                energia: Math.floor(Math.random() * 10) + 1,
                ansiedade: Math.floor(Math.random() * 10) + 1,
                sono: Math.floor(Math.random() * 10) + 1,
                atividades: ['exercicio', 'meditacao'],
                sintomas: [],
                medicamentos: '',
                observacoes: 'Dia produtivo, me sentindo bem.'
            });
        }

        // Adicionar metas de exemplo
        this.data.addMeta({
            pacienteId: '1',
            titulo: 'Meditar 10 minutos por dia',
            tipo: 'bem-estar',
            prazo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            progress: 70
        });

        this.data.addMeta({
            pacienteId: '1',
            titulo: 'Fazer exercício 3x por semana',
            tipo: 'fisico',
            prazo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            progress: 50
        });
    }

    verPaciente(pacienteId) {
        const paciente = this.data.getPaciente(pacienteId);
        if (paciente) {
            this.notifications.info(`Visualizando paciente: ${paciente.nome}`);
            // Aqui você implementaria a navegação para a página de detalhes do paciente
        }
    }
}

// Funções globais
window.limparFormulario = function() {
    const form = document.getElementById('registro-form');
    if (form) {
        form.reset();
        app.notifications.info('Formulário limpo');
    }
};

window.adicionarNovaMeta = function() {
    const titulo = prompt('Digite o título da meta:');
    if (titulo) {
        const meta = app.data.addMeta({
            pacienteId: app.auth.getCurrentUser().id,
            titulo: titulo,
            tipo: 'bem-estar',
            prazo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            progress: 0
        });
        app.notifications.success('Meta adicionada com sucesso!');
        app.loadMetas();
    }
};

window.gerarRelatorio = function(tipo) {
    app.notifications.info(`Gerando relatório ${tipo}...`);
    // Implementar geração de relatórios
};

window.exportarRelatorio = function() {
    app.notifications.success('Relatório exportado com sucesso!');
};

window.fecharRelatorio = function() {
    document.getElementById('relatorio-content').style.display = 'none';
};

window.agendarNovaSessao = function() {
    app.notifications.info('Funcionalidade de agendamento será implementada');
};

window.criarNovaNota = function() {
    app.notifications.info('Funcionalidade de notas será implementada');
};

window.mesAnterior = function() {
    app.notifications.info('Navegando para mês anterior');
};

window.mesProximo = function() {
    app.notifications.info('Navegando para próximo mês');
};

// Inicializar aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.app = new EquilibrarApp();
}); 