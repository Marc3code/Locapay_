document.addEventListener('DOMContentLoaded', function() {
  // Elementos da página
  const authTabs = document.querySelectorAll('.auth-tab');
  const authForms = document.querySelectorAll('.auth-form');
  const showSignupBtn = document.getElementById('show-signup');
  const showLoginBtn = document.getElementById('show-login');
  const ctaSignupBtn = document.getElementById('cta-signup');
  const authSection = document.getElementById('auth-section');
  const msgDiv = document.getElementById('msg');
  
  // Alternar entre abas de cadastro e login
  authTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove a classe active de todas as abas e formulários
      authTabs.forEach(t => t.classList.remove('active'));
      authForms.forEach(f => f.classList.remove('active'));
      
      // Adiciona a classe active à aba clicada e ao formulário correspondente
      this.classList.add('active');
      const formId = this.getAttribute('data-tab');
      document.querySelector(`.auth-form[data-form="${formId}"]`).classList.add('active');
    });
  });
  
  // Botões "Comece agora" e "Já tem conta" no hero section
  if (showSignupBtn && authSection) {
    showSignupBtn.addEventListener('click', function(e) {
      e.preventDefault();
      scrollToAuthSection('signup');
    });
  }
  
  if (showLoginBtn && authSection) {
    showLoginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      scrollToAuthSection('login');
    });
  }
  
  if (ctaSignupBtn && authSection) {
    ctaSignupBtn.addEventListener('click', function(e) {
      e.preventDefault();
      scrollToAuthSection('signup');
    });
  }
  
  function scrollToAuthSection(tab) {
    authSection.scrollIntoView({ behavior: 'smooth' });
    
    // Ativa a aba solicitada
    authTabs.forEach(t => t.classList.remove('active'));
    authForms.forEach(f => f.classList.remove('active'));
    document.querySelector(`.auth-tab[data-tab="${tab}"]`).classList.add('active');
    document.querySelector(`.auth-form[data-form="${tab}"]`).classList.add('active');
  }
  
  // Validação do formulário de cadastro
  const signupForm = document.getElementById('form-cadastro-locador');
  if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      msgDiv.textContent = '';
      msgDiv.className = 'message';

      const nome = signupForm.nome.value.trim();
      const senha = signupForm.senha.value;
      const cpf_cnpj = signupForm.cpf_cnpj.value.trim();
      const telefone = signupForm.telefone.value.trim();
      const plano = signupForm.plano.value;

      // Expressões regulares para validação

      const cpfCnpjRegex = /^\d{11}$|^\d{14}$/;
      const telefoneRegex = /^\+?\d{12,14}$/;

      // Verificações
      if (!nome || !senha || !cpf_cnpj || !telefone || !plano) {
        showError('Preencha todos os campos corretamente.');
        return;
      }

      if (senha.length < 6) {
        showError('A senha deve ter no mínimo 6 caracteres.');
        return;
      }

      if (!cpfCnpjRegex.test(cpf_cnpj)) {
        showError('CPF ou CNPJ inválido. Digite 11 ou 14 números.');
        return;
      }

      if (!telefoneRegex.test(telefone)) {
        showError('Telefone inválido. Ex: +5584912345678');
        return;
      }

      try {
        const res = await fetch('https://backend-isolado-production.up.railway.app/user/locadores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            nome, 
            senha, 
            cpf_cnpj, 
            telefone,
            plano 
          })
        });

        const data = await res.json();

        if (res.ok) {
          showSuccess('Cadastro realizado com sucesso! Logo mais nossa equipe entrará em contato. Até já!');
          signupForm.reset();
          
          // Recarrega a página após 2 segundos
          setTimeout(() => {
            window.reload()
          }, 2000);
        } else {
          showError(data.erro || 'Erro ao cadastrar locador.');
        }
      } catch (err) {
        showError('Erro na conexão com o servidor.');
        console.error(err);
      }
    });
  }
  
  // Validação do formulário de login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      msgDiv.textContent = '';
      msgDiv.className = 'message';

      const cpf_cnpj = loginForm.cpf_cnpj.value.trim();
      const senha = loginForm.senha.value;

      if (!cpf_cnpj || !senha) {
        showError('Preencha todos os campos.');
        return;
      }

      try {
        const response = await fetch('https://backend-isolado-production.up.railway.app/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cpf_cnpj, senha })
        });

        const data = await response.json();

        if (response.ok && data.token) {
          localStorage.setItem('token', data.token);
          showSuccess('Login realizado com sucesso!');
          
          // Redireciona após 1 segundo
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 1000);
        } else {
          showError(data.erro || 'Credenciais inválidas');
        }
      } catch (error) {
        showError('Erro ao conectar com o servidor');
        console.error('Erro na requisição:', error);
      }
    });
  }
  
  // Funções auxiliares para exibir mensagens
  function showError(message) {
    msgDiv.textContent = message;
    msgDiv.classList.add('error');
  }
  
  function showSuccess(message) {
    msgDiv.textContent = message;
    msgDiv.classList.add('success');
  }
});