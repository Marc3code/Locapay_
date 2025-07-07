import {
  buscarImoveis,
  buscarInquilinos,
  cadastrarImovel,
  vincularInquilino,
} from "./service.js";

import { carregarHeader } from "./renderHeader.js";
carregarHeader("imoveis");

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
    tr.addEventListener("click", () =>
      abrirFormularioVinculo(imovel.endereco, imovel.id)
    );
    tbody.appendChild(tr);
  });
}

// --- Exibe formulário de vinculação ---
async function abrirFormularioVinculo(imovelEndereco, imovelId) {
  const inquilinos = await buscarInquilinos();
  const container = document.getElementById("formulario-vinculo-container");
  const selectInquilino = container.querySelector("#inquilino_id");

  // Salva o ID do imóvel como atributo de dados
  container.dataset.imovelId = imovelId;

  // Preenche o select de inquilinos
  selectInquilino.innerHTML =
    '<option value="">Selecione um inquilino</option>';
  inquilinos.forEach((i) => {
    const option = document.createElement("option");
    option.value = i.id;
    option.textContent = i.nome;
    selectInquilino.appendChild(option);
  });

  // Atualiza o título do formulário
  container.querySelector(
    "h3"
  ).textContent = `Vincular Inquilino ao Imóvel do Endereço: ${imovelEndereco}`;

  container.classList.remove("hidden");
  selectInquilino.focus();
}

// Fechar formulário
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

// --- Envio do formulário de vínculo ---
document
  .getElementById("form-vinculo")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const container = document.getElementById("formulario-vinculo-container");
    const imovelId = parseInt(container.dataset.imovelId);

    const payload = {
      inquilino_id: parseInt(
        document.getElementById("inquilino_id").value
      ),
      imovel_id: imovelId,
      valor_aluguel: parseFloat(
        document.getElementById("valor_aluguel").value
      ),
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

// --- Cadastro de imóvel ---
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

// --- Inicialização ---
document.addEventListener("DOMContentLoaded", async () => {
  const imoveis = await buscarImoveis();
  renderImoveis(imoveis);
});

// Botão de mostrar/ocultar formulário de imóvel
document.getElementById("btn-toggle-form").addEventListener("click", () => {
  document.getElementById("form-section").classList.toggle("hidden");
});
