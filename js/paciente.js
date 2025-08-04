// Função para registrar humor
function registrarHumor() {
    const humorSelecionado = document.querySelector('.humor-option.selected');
    const escalaHumor = document.getElementById('humor-scale').value;
    const observacoes = document.getElementById('humor-notes').value;
    
    if (!humorSelecionado) {
        showNotification('Por favor, selecione um humor', 'warning');
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
    
    // Limpar formulário
    document.querySelectorAll('.humor-option').forEach(option => option.classList.remove('selected'));
    document.getElementById('humor-scale').value = 7;
    document.getElementById('scale-value').textContent = '7';
    document.getElementById('humor-notes').value = '';
    
    showNotification('Humor registrado com sucesso!', 'success');
    
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

// Função de navegação
function navegarPara(section) {
    // Esconder todas as seções
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar a seção selecionada
    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.classList.add('active');
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

// Inicializar eventos quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar eventos de humor
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
    
    // Navegação
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            navegarPara(section);
        });
    });
    
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('open');
        });
    }
    
    // Carregar dados iniciais
    carregarDadosIniciais();
});

// Carregar dados iniciais
function carregarDadosIniciais() {
    // Carregar humor atual
    const humoresSalvos = JSON.parse(localStorage.getItem('equilibrar_humores') || '[]');
    if (humoresSalvos.length > 0) {
        const ultimoHumor = humoresSalvos[humoresSalvos.length - 1];
        atualizarHumorAtual(ultimoHumor);
    }
    
    // Carregar histórico
    atualizarHistoricoHumor();
    
    // Carregar dados de exemplo
    carregarDadosExemplo();
}

// Carregar dados de exemplo
function carregarDadosExemplo() {
    const humoresSalvos = localStorage.getItem('equilibrar_humores');
    if (!humoresSalvos || JSON.parse(humoresSalvos).length === 0) {
        const dadosExemplo = [
            {
                id: Date.now() - 86400000,
                tipo: 'feliz',
                valor: 8,
                observacoes: 'Dia muito produtivo no trabalho',
                data: new Date(Date.now() - 86400000).toISOString(),
                timestamp: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: Date.now() - 172800000,
                tipo: 'calmo',
                valor: 7,
                observacoes: 'Sessão de terapia muito boa',
                data: new Date(Date.now() - 172800000).toISOString(),
                timestamp: new Date(Date.now() - 172800000).toISOString()
            }
        ];
        
        localStorage.setItem('equilibrar_humores', JSON.stringify(dadosExemplo));
        
        // Atualizar interface
        if (dadosExemplo.length > 0) {
            atualizarHumorAtual(dadosExemplo[dadosExemplo.length - 1]);
            atualizarHistoricoHumor();
        }
    }
} 