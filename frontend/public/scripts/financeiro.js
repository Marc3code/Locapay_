import { buscarSaldo, buscarMovimentações } from "./service.js";
import { carregarHeader } from "./header/renderHeader.js";

carregarHeader("financeiro");

// Formata valores monetários para real brasileiro
function formatarValor(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Formata datas para DD/MM/YYYY
function formatarData(dataString) {
  if (!dataString) return "-";
  const data = new Date(dataString);
  return data.toLocaleDateString("pt-BR");
}

// Atualiza os valores de saldo na tela
async function atualizarSaldos() {
  try {
    const saldo = await buscarSaldo();
    console.log(saldo)
    document.getElementById("saldoTotal").textContent = formatarValor(saldo.saldo_total ?? 0);
    document.getElementById("saldoBloqueado").textContent = formatarValor(saldo.saldo_bloqueado ?? 0);
  } catch (error) {
    console.error("Erro ao buscar saldo:", error);
    document.getElementById("saldoTotal").textContent = "Erro";
    document.getElementById("saldoBloqueado").textContent = "Erro";
  }
}

// Renderiza histórico de saques na tabela
async function renderizarSaques() {
  try {
    const saques = await buscarSaques();
    const tbody = document.getElementById("tabelaSaques");
    if (!saques.length) {
      tbody.innerHTML = '<tr><td colspan="3">Nenhum saque encontrado</td></tr>';
      return;
    }

    tbody.innerHTML = "";
    saques.forEach((saque) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${formatarData(saque.data)}</td>
        <td>${formatarValor(saque.valor)}</td>
        <td>${saque.status ?? "-"}</td>
      `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao buscar saques:", error);
    const tbody = document.getElementById("tabelaSaques");
    tbody.innerHTML = '<tr><td colspan="3">Erro ao carregar saques</td></tr>';
  }
}

// Renderiza movimentações de saldo na tabela
async function renderizarMovimentacoes() {
  try {
    const movimentacoes = await buscarMovimentações();
    console.log(movimentacoes)
    const tbody = document.getElementById("tabelaTransacoes");
    if (!movimentacoes.length) {
      tbody.innerHTML = '<tr><td colspan="4">Nenhuma movimentação encontrada</td></tr>';
      return;
    }

    tbody.innerHTML = "";
    movimentacoes.forEach((mov) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${formatarData(mov.criado_em)}</td>
        <td>${mov.descricao ?? "-"}</td>
        <td>${mov.tipo ?? "-"}</td>
        <td>${formatarValor(mov.valor)}</td>
      `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao buscar movimentações:", error);
    const tbody = document.getElementById("tabelaTransacoes");
    tbody.innerHTML = '<tr><td colspan="4">Erro ao carregar movimentações</td></tr>';
  }
}

// Inicializa tela financeira
async function init() {
  await atualizarSaldos();
  await renderizarSaques();
  await renderizarMovimentacoes();
}

// Evento botão saque
document.getElementById("btnSacar").addEventListener("click", () => {
  alert("Solicitação de saque iniciada!");
  // Aqui você pode abrir modal, redirecionar, etc.
});

document.addEventListener("DOMContentLoaded", init);
