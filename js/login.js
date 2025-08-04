// Usuários mockados
const usuarios = [
    {
        username: 'paciente1',
        password: '1234',
        tipo: 'paciente',
        nome: 'João Silva',
        email: 'joao.silva@email.com',
        telefone: '(11) 91234-5678',
        proximaSessao: '10/06/2024 às 14:00',
        psicoterapeuta: 'Dra. Ana Paula',
        historico: [
            { data: '03/06/2024', descricao: 'Sessão sobre ansiedade' },
            { data: '27/05/2024', descricao: 'Sessão sobre autoconhecimento' }
        ]
    },
    {
        username: 'psico1',
        password: 'abcd',
        tipo: 'psicoterapeuta',
        nome: 'Ana Paula',
        email: 'ana.paula@psico.com',
        telefone: '(11) 99876-5432',
        pacientes: [
            {
                nome: 'João Silva',
                proximaSessao: '10/06/2024 às 14:00',
                email: 'joao.silva@email.com',
                telefone: '(11) 91234-5678',
                historico: [
                    { data: '03/06/2024', descricao: 'Sessão sobre ansiedade' },
                    { data: '27/05/2024', descricao: 'Sessão sobre autoconhecimento' }
                ]
            },
            {
                nome: 'Maria Souza',
                proximaSessao: '12/06/2024 às 16:00',
                email: 'maria.souza@email.com',
                telefone: '(11) 93456-7890',
                historico: [
                    { data: '05/06/2024', descricao: 'Sessão sobre autoestima' }
                ]
            }
        ]
    }
];

// Elementos do DOM
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const usernameInput = document.getElementById('username');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Focar no campo de usuário
    usernameInput.focus();
    
    // Adicionar efeito de loading no botão
    const loginBtn = document.querySelector('.login-btn');
    loginBtn.addEventListener('click', function() {
        if (loginForm.checkValidity()) {
            this.innerHTML = '<span>Entrando...</span><i class="fas fa-spinner fa-spin"></i>';
            this.disabled = true;
        }
    });
});

// Mostrar/ocultar senha
if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.innerHTML = type === 'password' ? 
            '<i class="fas fa-eye"></i>' : 
            '<i class="fas fa-eye-slash"></i>';
    });
}

// Processar login
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    // Validação básica
    if (!username || !password) {
        mostrarErro('Por favor, preencha todos os campos');
        return;
    }
    
    // Buscar usuário
    const usuario = usuarios.find(u => 
        u.username.toLowerCase() === username.toLowerCase() && 
        u.password === password
    );

    if (!usuario) {
        mostrarErro('Usuário ou senha inválidos');
        return;
    }
    
    // Login bem-sucedido
    ocultarErro();
    mostrarSucesso(`Bem-vindo(a), ${usuario.nome}!`);
    
    // Salvar dados do usuário
    localStorage.setItem('equilibrar_usuario_atual', JSON.stringify(usuario));
    
    // Redirecionar após delay
    setTimeout(() => {
        if (usuario.tipo === 'paciente') {
            window.location.href = 'paciente.html';
        } else if (usuario.tipo === 'psicoterapeuta') {
            window.location.href = 'psicologo.html';
        }
    }, 1500);
});

// Funções de feedback
function mostrarErro(mensagem) {
    loginError.querySelector('span').textContent = mensagem;
    loginError.style.display = 'flex';
    loginError.style.animation = 'shake 0.5s ease-in-out';
    
    // Resetar botão
    const loginBtn = document.querySelector('.login-btn');
    loginBtn.innerHTML = '<span>Entrar</span><i class="fas fa-arrow-right"></i>';
    loginBtn.disabled = false;
    
    // Focar no campo de senha se houver erro
    passwordInput.focus();
}

function ocultarErro() {
    loginError.style.display = 'none';
}

function mostrarSucesso(mensagem) {
    // Criar notificação de sucesso
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${mensagem}</span>
    `;
    
    const notifications = document.getElementById('notifications');
    notifications.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
}

// Animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .login-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    .fa-spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Melhorias de UX
usernameInput.addEventListener('input', function() {
    if (this.value.trim()) {
        this.style.borderColor = 'var(--primary)';
    } else {
        this.style.borderColor = 'var(--border)';
    }
    ocultarErro();
});

passwordInput.addEventListener('input', function() {
    if (this.value) {
        this.style.borderColor = 'var(--primary)';
    } else {
        this.style.borderColor = 'var(--border)';
    }
    ocultarErro();
});

// Navegação por teclado
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.activeElement === passwordInput) {
        loginForm.dispatchEvent(new Event('submit'));
    }
});

// Auto-complete para desenvolvimento
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔑 Credenciais de desenvolvimento:');
    console.log('👤 Paciente: paciente1 / 1234');
    console.log('👨‍⚕️ Psicólogo: psico1 / abcd');

} 

