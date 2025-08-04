// Verificação de login
function checkLogin() {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
        // Se não há usuário logado, redirecionar para login
        window.location.href = 'index.html';
        return null;
    }

    const user = JSON.parse(userInfo);
    const loginTime = new Date(user.loginTime);
    const now = new Date();
    const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
    
    // Se o login foi há mais de 24 horas, fazer logout
    if (hoursSinceLogin >= 24) {
        localStorage.removeItem('userInfo');
        window.location.href = 'index.html';
        return null;
    }

    return user;
}

// Função de logout
function logout() {
    localStorage.removeItem('userInfo');
    showNotification('Logout realizado com sucesso!', 'success', 2000);
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Função para mostrar notificações
function showNotification(message, type = 'info', duration = 5000) {
    const notificationsContainer = document.getElementById('notifications');
    if (!notificationsContainer) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    notificationsContainer.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Auto-remover após duração
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }, duration);

    // Botão de fechar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    });
}

// Função para atualizar informações do usuário na interface
function updateUserInfo(user) {
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = user.username === 'paciente' ? 'Maria Silva' : 'Dr. Silva';
    }
}

// Função para navegação entre seções
function navigateToSection(sectionId) {
    // Esconder todas as seções
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar a seção selecionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Atualizar navegação ativa
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Verificar login (DESABILITADO - não redirecionar automaticamente)
    // const user = checkLogin();
    // if (!user) return;
    
    // Simular usuário logado para demonstração
    const user = {
        username: window.location.href.includes('paciente.html') ? 'paciente' : 'psicologo',
        userType: window.location.href.includes('paciente.html') ? 'paciente' : 'psicologo'
    };

    // Atualizar informações do usuário
    updateUserInfo(user);

    // Event listener para logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Event listeners para navegação
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            if (sectionId) {
                navigateToSection(sectionId);
            }
        });
    });

    // Sidebar toggle para mobile
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });

        // Fechar sidebar ao clicar fora (mobile)
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024) {
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            }
        });
    }

    // Animações de entrada
    const cards = document.querySelectorAll('.card, .action-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });

    // Mostrar notificação de boas-vindas
    setTimeout(() => {
        showNotification(`Bem-vindo(a) de volta, ${user.username === 'paciente' ? 'Maria' : 'Dr. Silva'}!`, 'success', 3000);
    }, 1000);
});

// Função para formatar data
function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}

// Função para formatar hora
function formatTime(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Função para obter data atual formatada
function getCurrentDate() {
    return formatDate(new Date());
}

// Função para obter hora atual formatada
function getCurrentTime() {
    return formatTime(new Date());
} 