const form = document.getElementById('form-cadastro-locador');
const msg = document.getElementById('msg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = '';
  msg.className = 'message';

  const nome = form.nome.value.trim();
  const email = form.email.value.trim();
  const senha = form.senha.value;
  const cpf_cnpj = form.cpf_cnpj.value.trim();
  const telefone = form.telefone.value.trim();

  // Expressões regulares para validação
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cpfCnpjRegex = /^\d{11}$|^\d{14}$/;
  const telefoneRegex = /^\+?\d{12,14}$/;

  // Verificações
  if (!nome || !email || !senha || !cpf_cnpj || !telefone) {
    msg.textContent = 'Preencha todos os campos corretamente.';
    msg.classList.add('error');
    return;
  }

  if (!emailRegex.test(email)) {
    msg.textContent = 'Informe um e-mail válido.';
    msg.classList.add('error');
    return;
  }

  if (senha.length < 6) {
    msg.textContent = 'A senha deve ter no mínimo 6 caracteres.';
    msg.classList.add('error');
    return;
  }

  if (!cpfCnpjRegex.test(cpf_cnpj)) {
    msg.textContent = 'CPF ou CNPJ inválido. Digite 11 ou 14 números.';
    msg.classList.add('error');
    return;
  }

  if (!telefoneRegex.test(telefone)) {
    msg.textContent = 'Telefone inválido. Ex: +5584912345678';
    msg.classList.add('error');
    return;
  }

  try {
    const res = await fetch('https://backend-isolado-production.up.railway.app/user/locadores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha, cpf_cnpj, telefone })
    });

    const data = await res.json();

    if (res.ok) {
      msg.textContent = 'Locador cadastrado com sucesso!';
      msg.classList.add('success');
      form.reset();
    } else {
      msg.textContent = data.erro || 'Erro ao cadastrar locador.';
      msg.classList.add('error');
    }
  } catch (err) {
    msg.textContent = 'Erro na conexão com o servidor.';
    msg.classList.add('error');
    console.error(err);
  }
});
