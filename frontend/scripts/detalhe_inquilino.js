import { buscarInquilinos, buscarPagamentos } from "./service.js";

function formatDate(dateString) {
  if (!dateString) return "-";
  const d = new Date(dateString);
  return d.toLocaleDateString("pt-BR");
}

function formatCurrency(value) {
  return "R$ " + parseFloat(value).toFixed(2).replace(".", ",");
}

const urlParams = new URLSearchParams(window.location.search);
const inquilinoId = parseInt(urlParams.get("inquilino_id"));

const infoDiv = document.getElementById("info-inquilino");
const table = document.getElementById("pagamentos-table");
const tbody = table.querySelector("tbody");
const errorMsg = document.getElementById("error-msg");

if (!inquilinoId) {
  infoDiv.style.display = "none";
  errorMsg.style.display = "block";
  errorMsg.textContent = "ID do inquilino não fornecido na URL.";
  table.style.display = "none";
  throw new Error("inquilino_id não informado na URL");
}

async function carregarDados() {
  try {
    const inquilinos = await buscarInquilinos();
    const pagamentos = await buscarPagamentos();

    const inquilino = inquilinos.find((i) => i.inquilino_id === inquilinoId);

    if (!inquilino) {
      throw new Error("Inquilino não encontrado");
    }

    const pagamentosInquilino = pagamentos.filter(
      (p) => p.inquilino_id === inquilinoId
    );

    infoDiv.style.display = "block";
    infoDiv.classList.remove("loading");
    infoDiv.innerHTML = `
            <p><strong>Nome:</strong> ${inquilino.nome}</p>
            <p><strong>Telefone:</strong> ${inquilino.telefone}</p>
            <p><strong>CPF/CNPJ:</strong> ${inquilino.cpfCnpj}</p>
            <p><strong>Endereço:</strong> ${inquilino.endereco}, ${
      inquilino.numero
    } ${inquilino.complemento || ""}</p>
            <p><strong>Valor do Aluguel:</strong> ${formatCurrency(
              inquilino.valor_aluguel
            )}</p>
          `;

    if (pagamentosInquilino.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6">Nenhum pagamento encontrado para este inquilino.</td></tr>`;
      table.style.display = "table";
      return;
    }

    tbody.innerHTML = "";
    pagamentosInquilino.forEach((p) => {
      const statusClass = p.status ? p.status.toLowerCase() : "";
      tbody.innerHTML += `
              <tr>
                <td>${p.asaas_payment_id}</td>
                <td>${formatDate(p.due_date)}</td>
                <td>${formatDate(p.payment_date)}</td>
                <td>${formatCurrency(p.amount)}</td>
                <td class="status ${statusClass}">${p.status}</td>
                <td><a href="${
                  p.link_pagamento
                }" target="_blank" rel="noopener noreferrer">Link</a></td>
              </tr>
            `;
    });
    table.style.display = "table";
  } catch (error) {
    infoDiv.style.display = "none";
    errorMsg.style.display = "block";
    errorMsg.textContent = "Erro ao carregar dados: " + error.message;
    table.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  carregarDados();
});
