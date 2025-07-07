const form = document.getElementById("login-form");
const mensagemErro = document.getElementById("mensagem-erro");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const response = await fetch("https://backend-isolado-production.up.railway.app/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (response.ok && data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "/home.html"; // redireciona após login
    } else {
      mensagemErro.textContent = data.erro || "Credenciais inválidas";
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    mensagemErro.textContent = "Erro ao conectar com o servidor";
  }
});
