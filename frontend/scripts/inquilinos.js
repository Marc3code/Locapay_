const API_INQUILINOS =
  "https://backend-isolado-production.up.railway.app/inquilinos";

import { carregarHeader } from "./renderHeader.js";
carregarHeader("inquilinos");

// Buscar inquilinos
async function buscarInquilinos() {
  try {
    const res = await fetch(API_INQUILINOS);
    if (!res.ok) throw new Error("Erro ao buscar inquilinos");
    return await res.json();
  } catch (err) {
    console.error(err.message);
    return [];
  }
}

// Cadastrar novo inquilino
async function cadastrarInquilino(inquilino) {
  try {
    const res = await fetch(API_INQUILINOS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inquilino),
    });
    if (!res.ok) throw new Error("Erro ao cadastrar inquilino");
    alert("Inquilino cadastrado com sucesso!");
    return await res.json();
  } catch (err) {
    console.error(err.message);
    alert("Erro ao cadastrar inquilino.");
  }
}

// Renderiza tabela
function renderInquilinos(lista) {
  const tbody = document.querySelector("#tabela-inquilinos tbody");
  tbody.innerHTML = "";

  if (!lista.length) {
    tbody.innerHTML = `<tr><td colspan="4">Nenhum inquilino cadastrado.</td></tr>`;
    return;
  }

  lista.forEach((i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i.nome}</td>
      <td>${i.telefone}</td>
      <td>${i.id_asaas}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Cadastro via formulário
document
  .getElementById("form-inquilino")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const CPF = document.getElementById("CPF").value;
    const telefone = document.getElementById("telefone").value;

    if (!nome || !telefone || !CPF) {
      alert("Preencha todos os campos.");
      return;
    }

    const novo = { nome, telefone, CPF };
    await cadastrarInquilino(novo);
    document.getElementById("form-inquilino").reset();
    const lista = await buscarInquilinos();
    renderInquilinos(lista);
  });

// Mostrar/ocultar formulário
document.getElementById("btn-toggle-form").addEventListener("click", () => {
  document.getElementById("form-section").classList.toggle("hidden");
});

// Ao carregar
document.addEventListener("DOMContentLoaded", async () => {
  const inquilinos = await buscarInquilinos();
  renderInquilinos(inquilinos);
});
