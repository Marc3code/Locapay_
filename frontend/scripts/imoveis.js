const API_IMOVEIS = "https://backend-isolado-production.up.railway.app/imoveis";
const API_INQUILINOS =
  "https://backend-isolado-production.up.railway.app/inquilinos";
const API_VINCULAR =
  "https://backend-isolado-production.up.railway.app/inquilinos/inquilino-imovel";

// --- Buscar imóveis ---
async function buscarImoveis() {
  try {
    const res = await fetch(API_IMOVEIS);
    if (!res.ok) throw new Error("Erro ao buscar imóveis");
    return await res.json();
  } catch (err) {
    console.error("Erro ao buscar imóveis:", err.message);
    return [];
  }
}

// --- Cadastrar imóvel ---
async function cadastrarImovel(imovel) {
  try {
    const res = await fetch(API_IMOVEIS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(imovel),
    });
    if (!res.ok) throw new Error("Erro ao cadastrar imóvel");
    return await res.json();
  } catch (err) {
    console.error("Erro ao cadastrar imóvel:", err.message);
    alert("Erro ao cadastrar imóvel.");
  }
}

// --- Buscar inquilinos ---
async function buscarInquilinos() {
  try {
    const res = await fetch(API_INQUILINOS);
    if (!res.ok) throw new Error("Erro ao buscar inquilinos");
    return await res.json();
  } catch (err) {
    console.error("Erro ao buscar inquilinos:", err.message);
    return [];
  }
}

// --- Vincular inquilino a imóvel ---
async function vincularInquilino(dados) {
  try {
    const res = await fetch(API_VINCULAR, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (!res.ok) throw new Error("Erro ao vincular inquilino");
    alert("Inquilino vinculado com sucesso!");
  } catch (err) {
    console.error("Erro ao vincular inquilino:", err.message);
    alert("Erro ao vincular inquilino.");
  }
}

// --- Renderiza imóveis ---
function renderImoveis(lista) {
  const tbody = document.querySelector("#tabela-imoveis tbody");
  tbody.innerHTML = "";

  if (!lista.length) {
    tbody.innerHTML = `<tr><td colspan="4">Nenhum imóvel cadastrado.</td></tr>`;
    return;
  }

  lista.forEach((imovel) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${imovel.id}</td>
      <td>${imovel.tipo}</td>
      <td>${imovel.endereco}</td>
      <td>${imovel.numero}</td>
    `;
    tr.addEventListener("click", () => abrirFormularioVinculo(imovel.endereco));
    tbody.appendChild(tr);
  });
}

// --- Exibe formulário de vinculação ---
async function abrirFormularioVinculo(imovelEndereco) {
  const inquilinos = await buscarInquilinos();
  const container = document.getElementById("formulario-vinculo-container");
  const selectInquilino = container.querySelector("#inquilino_id");

  // Preenche o select de inquilinos
  selectInquilino.innerHTML =
    '<option value="">Selecione um inquilino</option>';
  inquilinos.forEach((i) => {
    const option = document.createElement("option");
    option.value = i.id;
    option.textContent = i.nome;
    selectInquilino.appendChild(option);
  });

  // Atualiza o título com o ID do imóvel
  container.querySelector(
    "h3"
  ).textContent = `Vincular Inquilino ao Imóvel do Endereço: ${imovelEndereco}`;

  // Mostra o formulário
  container.classList.remove("hidden");

  // Foca no primeiro campo
  selectInquilino.focus();
}

// Fechar formulário de vinculação
document.getElementById("close-vinculo-form")?.addEventListener("click", () => {
  document
    .getElementById("formulario-vinculo-container")
    .classList.add("hidden");
});

document.getElementById("btn-cancelar")?.addEventListener("click", () => {
  document
    .getElementById("formulario-vinculo-container")
    .classList.add("hidden");
});

// --- Vincular inquilino ---
document
  .getElementById("form-vinculo")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const container = document.getElementById("formulario-vinculo-container");
    const imovelId = parseInt(
      container.querySelector("h3").textContent.match(/#(\d+)/)[1]
    );

    const payload = {
      inquilino_id: parseInt(document.getElementById("inquilino_id").value),
      imovel_id: imovelId,
      valor_aluguel: parseFloat(document.getElementById("valor_aluguel").value),
      complemento: document.getElementById("complemento").value,
      data_inicio: document.getElementById("data_inicio").value,
      data_vencimento: document.getElementById("data_vencimento").value,
      data_fim: document.getElementById("data_fim").value || null,
    };

    try {
      await vincularInquilino(payload);
      container.classList.add("hidden");
      document.getElementById("form-vinculo").reset();
    } catch (err) {
      console.error("Erro ao vincular:", err);
    }
  });

// --- Cadastro do imóvel ---
document
  .getElementById("form-imovel")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const tipo = document.getElementById("tipo").value;
    const endereco = document.getElementById("endereco").value;
    const numero = document.getElementById("numero").value;

    if (!tipo || !endereco || !numero) {
      alert("Preencha todos os campos.");
      return;
    }

    const novoImovel = { tipo, endereco, numero };
    await cadastrarImovel(novoImovel);

    this.reset();
    const imoveis = await buscarImoveis();
    renderImoveis(imoveis);
  });

// --- Carregar ao iniciar ---
document.addEventListener("DOMContentLoaded", async () => {
  const imoveis = await buscarImoveis();
  renderImoveis(imoveis);
});

document.getElementById("btn-toggle-form").addEventListener("click", () => {
  document.getElementById("form-section").classList.toggle("hidden");
});
