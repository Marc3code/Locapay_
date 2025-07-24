document.addEventListener("DOMContentLoaded", function () {
  // Elementos da página
  const authTabs = document.querySelectorAll(".auth-tab");
  const authForms = document.querySelectorAll(".auth-form");
  const showSignupBtn = document.getElementById("show-signup");
  const showLoginBtn = document.getElementById("show-login");
  const ctaSignupBtn = document.getElementById("cta-signup");
  const authSection = document.getElementById("auth-section");
  const msgDiv = document.getElementById("msg");
  const nextStepBtn = document.getElementById("next-step");
  const prevStepBtn = document.getElementById("prev-step"); // botão voltar
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");

  // Alternar entre abas de cadastro e login
  authTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      authTabs.forEach((t) => t.classList.remove("active"));
      authForms.forEach((f) => f.classList.remove("active"));
      this.classList.add("active");
      const formId = this.getAttribute("data-tab");
      document
        .querySelector(`.auth-form[data-form="${formId}"]`)
        .classList.add("active");
    });
  });

  // Botões da landing
  if (showSignupBtn && authSection) {
    showSignupBtn.addEventListener("click", function (e) {
      e.preventDefault();
      scrollToAuthSection("signup");
    });
  }

  if (showLoginBtn && authSection) {
    showLoginBtn.addEventListener("click", function (e) {
      e.preventDefault();
      scrollToAuthSection("login");
    });
  }

  if (ctaSignupBtn && authSection) {
    ctaSignupBtn.addEventListener("click", function (e) {
      e.preventDefault();
      scrollToAuthSection("signup");
    });
  }

  function scrollToAuthSection(tab) {
    authSection.scrollIntoView({ behavior: "smooth" });
    authTabs.forEach((t) => t.classList.remove("active"));
    authForms.forEach((f) => f.classList.remove("active"));
    document
      .querySelector(`.auth-tab[data-tab="${tab}"]`)
      .classList.add("active");
    document
      .querySelector(`.auth-form[data-form="${tab}"]`)
      .classList.add("active");
  }

  // Mostrar ou esconder botão "Voltar" de acordo com a etapa
  function toggleBackButton(step) {
    if (prevStepBtn) {
      prevStepBtn.style.display = step === 1 ? "inline-block" : "none";
    }
  }

  if (nextStepBtn) {
    nextStepBtn.addEventListener("click", function () {
      const nome = document.getElementById("nome").value.trim();
      const senha = document.getElementById("senha").value;
      const cpf_cnpj = document.getElementById("cpf_cnpj").value.trim();
      const telefone = document.getElementById("telefone").value.trim();
      const email = document.getElementById("email").value.trim();
      const rendaMensal = document.getElementById("rendaMensal").value.trim();
      const plano = document.getElementById("plano").value;

      const cpfCnpjRegex = /^\d{11}$|^\d{14}$/;
      const telefoneRegex = /^\+?\d{12,14}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !nome ||
        !senha ||
        !cpf_cnpj ||
        !telefone ||
        !email ||
        !rendaMensal ||
        !plano
      ) {
        showError("Preencha todos os campos da etapa 1.");
        return;
      }

      if (senha.length < 6) {
        showError("A senha deve ter no mínimo 6 caracteres.");
        return;
      }

      if (!cpfCnpjRegex.test(cpf_cnpj)) {
        showError("CPF ou CNPJ inválido. Digite 11 ou 14 números.");
        return;
      }

      if (!telefoneRegex.test(telefone)) {
        showError("Telefone inválido. Ex: +5584912345678");
        return;
      }

      if (!emailRegex.test(email)) {
        showError("E-mail inválido.");
        return;
      }

      // Ir para etapa 2
      step1.style.display = "none";
      step2.style.display = "block";
      toggleBackButton(1);
      msgDiv.textContent = "";
      msgDiv.className = "message";
    });
  }

  // Botão "Voltar" - retorna à etapa 1
  if (prevStepBtn) {
    prevStepBtn.addEventListener("click", function () {
      step2.style.display = "none";
      step1.style.display = "block";
      toggleBackButton(0);
    });

    // Garante que o botão não apareça na primeira etapa ao carregar
    toggleBackButton(0);
  }

  // Validação do formulário de cadastro
  const signupForm = document.getElementById("form-cadastro-locador");
  if (signupForm) {
    signupForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      msgDiv.textContent = "";
      msgDiv.className = "message";

      const nome = signupForm.nome.value.trim();
      const dataNascimento = signupForm.dataNascimento.value.trim()
      const email = signupForm.email.value.trim();
      const senha = signupForm.senha.value;
      const cpf_cnpj = signupForm.cpf_cnpj.value.trim();
      const telefone = signupForm.telefone.value.trim();
      const plano = signupForm.plano.value;
      const rendaMensal = signupForm.rendaMensal.value.trim();
      const rua = signupForm.rua.value.trim();
      const numeroEndereco = signupForm.numeroEndereco.value.trim();
      const complemento = signupForm.complemento.value.trim();
      const bairro = signupForm.bairro.value.trim();
      const cep = signupForm.cep.value.trim();

      const cpfCnpjRegex = /^\d{11}$|^\d{14}$/;
      const telefoneRegex = /^\+?\d{12,14}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const cepRegex = /^\d{8}$/;

      if (
        !nome ||
        !senha ||
        !cpf_cnpj ||
        !telefone ||
        !plano ||
        !email ||
        !rendaMensal ||
        !rua ||
        !numeroEndereco ||
        !bairro ||
        !cep
      ) {
        showError("Preencha todos os campos corretamente.");
        return;
      }

      if (senha.length < 6) {
        showError("A senha deve ter no mínimo 6 caracteres.");
        return;
      }

      if (!cpfCnpjRegex.test(cpf_cnpj)) {
        showError("CPF ou CNPJ inválido. Digite 11 ou 14 números.");
        return;
      }

      if (!telefoneRegex.test(telefone)) {
        showError("Telefone inválido. Ex: +5584912345678");
        return;
      }

      if (!emailRegex.test(email)) {
        showError("E-mail inválido.");
        return;
      }

      if (!cepRegex.test(cep)) {
        showError("CEP inválido. Digite 8 números.");
        return;
      }

      try {
        const res = await fetch(
          "https://backend-isolado-production.up.railway.app/user/locadores",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nome,
              dataNascimento,
              email,
              senha,
              cpf_cnpj,
              telefone,
              plano,
              rendaMensal,
              rua,
              numeroEndereco,
              complemento,
              bairro,
              cep,
            }),
          }
        );

        const data = await res.json();

        if (res.ok) {
          showSuccess(
            "Cadastro realizado com sucesso! Logo mais nossa equipe entrará em contato. Até já!"
          );
          signupForm.reset();
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          showError(data.erro || "Erro ao cadastrar locador.");
        }
      } catch (err) {
        showError("Erro na conexão com o servidor.");
        console.error(err);
      }
    });
  }

  // Validação do login
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      msgDiv.textContent = "";
      msgDiv.className = "message";

      const cpf_cnpj = loginForm.cpf_cnpj.value.trim();
      const senha = loginForm.senha.value;

      if (!cpf_cnpj || !senha) {
        showError("Preencha todos os campos.");
        return;
      }

      try {
        const response = await fetch(
          "https://backend-isolado-production.up.railway.app/user/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cpf_cnpj, senha }),
          }
        );

        const data = await response.json();

        if (response.ok && data.token) {
          localStorage.setItem("token", data.token);
          showSuccess("Login realizado com sucesso!");
          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 1000);
        } else {
          showError(data.erro || "Credenciais inválidas");
        }
      } catch (error) {
        showError("Erro ao conectar com o servidor");
        console.error("Erro na requisição:", error);
      }
    });
  }

  // Funções auxiliares
  function showError(message) {
    msgDiv.textContent = message;
    msgDiv.className = "message error";
  }

  function showSuccess(message) {
    msgDiv.textContent = message;
    msgDiv.className = "message success";
  }
});
