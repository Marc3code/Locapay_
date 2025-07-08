import { carregarHeader } from "./header/renderHeader.js";
import {
  buscarInquilinos,
  buscarInquilinosComImovel,
  cadastrarInquilino,
} from "./service.js";

carregarHeader("inquilinos");

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
    const cpfCnpj = document.getElementById("CPF").value;
    const telefone = document.getElementById("telefone").value;

    if (!nome || !telefone || !cpfCnpj) {
      alert("Preencha todos os campos.");
      return;
    }

    const novo = {
      name: nome,
      phone: telefone,
      cpfCnpj: cpfCnpj,
    };

    await cadastrarInquilino(novo);
    document.getElementById("form-inquilino").reset();

    const lista = await buscarInquilinosComImovel();
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
