import { buscarInquilinosComContrato, buscarPagamentos } from "./service.js";

function formatDate(dateString) {
  if (!dateString) return "-";
  const [year, month, day] = dateString.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
}

function formatCurrency(value) {
  return "R$ " + parseFloat(value).toFixed(2).replace(".", ",");
}

// Lê o inquilinoId do localStorage
const inquilinoId = parseInt(localStorage.getItem("inquilino_id"));



const infoDiv = document.getElementById("info-inquilino");
const table = document.getElementById("pagamentos-table");
const tbody = table.querySelector("tbody");
const errorMsg = document.getElementById("error-msg");

if (!inquilinoId) {
  infoDiv.style.display = "none";
  errorMsg.style.display = "block";
  errorMsg.textContent = "ID do inquilino não encontrado no localStorage.";
  table.style.display = "none";
  throw new Error("inquilino_id não encontrado no localStorage");
}

async function carregarDados() {
  try {
    const inquilinos = await buscarInquilinosComContrato();
    const pagamentos = await buscarPagamentos();

    const inquilino = inquilinos.find((i) => i.inquilino_id === inquilinoId);

    if (!inquilino) {
      throw new Error("Inquilino não encontrado");
    }

    const pagamentosInquilino = pagamentos.filter(
      (p) => p.contrato_id === inquilino.contrato_id
    );

    infoDiv.style.display = "block";
    infoDiv.classList.remove("loading");
    infoDiv.innerHTML = `
      <p><strong>Nome:</strong> ${inquilino.nome}</p>
      <p><strong>Telefone:</strong> ${inquilino.telefone}</p>
      <p><strong>CPF/CNPJ:</strong> ${inquilino.cpf_cnpj}</p>
      <p><strong>Endereço:</strong> ${inquilino.endereco}, ${inquilino.numero} ${inquilino.complemento || ""}</p>
      <p><strong>Valor do Aluguel:</strong> ${formatCurrency(inquilino.valor_aluguel)}</p>
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
          <td><span class="status ${statusClass}">${p.status}</span></td>
          <td><a href="${p.link_pagamento}" target="_blank" rel="noopener noreferrer">Link</a></td>
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
