import {
  buscarSaldo,
  buscarMovimentações,
  buscarSaques,
  cadastrarChavePix,
} from "./service.js";
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
    document.getElementById("saldoTotal").textContent = formatarValor(
      saldo.saldo_total ?? 0
    );
    document.getElementById("saldoBloqueado").textContent = formatarValor(
      saldo.saldo_bloqueado ?? 0
    );
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
        <td>${formatarData(saque.criado_em)}</td>
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
    const tbody = document.getElementById("tabelaTransacoes");
    if (!movimentacoes.length) {
      tbody.innerHTML =
        '<tr><td colspan="4">Nenhuma movimentação encontrada</td></tr>';
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
    tbody.innerHTML =
      '<tr><td colspan="4">Erro ao carregar movimentações</td></tr>';
  }
}

// Inicializa tela financeira
async function init() {
  await atualizarSaldos();
  await renderizarSaques();
  await renderizarMovimentacoes();
}

document.addEventListener("DOMContentLoaded", init);

const modalSaque = document.getElementById("modalSaque");
const btnSacar = document.getElementById("btnSacar");
const btnConfirmar = document.getElementById("confirmarSaque");
const btnCancelar = document.getElementById("cancelarSaque");
const inputValor = document.getElementById("valorSaque");

// Abrir modal
btnSacar.addEventListener("click", () => {
  inputValor.value = "";
  modalSaque.style.display = "flex";
});

// Cancelar
btnCancelar.addEventListener("click", () => {
  modalSaque.style.display = "none";
});

// Confirmar saque
btnConfirmar.addEventListener("click", () => {
  const valor = parseFloat(inputValor.value);
  if (isNaN(valor) || valor <= 2) {
    alert("O valor mínimo para saque é R$ 2,01 (taxa de R$ 2,00 aplicada).");
    return;
  }

  // Aqui você pode fazer a requisição de saque (fetch/post/etc)
  alert(
    `Saque solicitado: R$ ${valor.toFixed(2)} (R$ ${(valor - 2).toFixed(
      2
    )} líquidos após taxa).`
  );

  modalSaque.style.display = "none";
});

const modalChavePix = document.getElementById("modalChavePix");
const btnChavePix = document.getElementById("btnChavePix");
const btnSalvarChave = document.getElementById("salvarChavePix");
const btnCancelarChave = document.getElementById("cancelarChavePix");
const inputChavePix = document.getElementById("inputChavePix");

// Abrir modal de chave Pix
btnChavePix.addEventListener("click", () => {
  inputChavePix.value = "";
  modalChavePix.style.display = "flex";
});

// Cancelar modal
btnCancelarChave.addEventListener("click", () => {
  modalChavePix.style.display = "none";
});

// Salvar chave Pix
btnSalvarChave.addEventListener("click", async () => {
  const chave = inputChavePix.value.trim();
  if (!chave) {
    alert("Por favor, preencha a chave Pix.");
    return;
  }
  try {
    const cadastro = await cadastrarChavePix(chave);

    if (cadastro?.erro) {
      alert(`Erro ao cadastrar chave Pix: ${cadastro.erro}`);
      return;
    }

    alert("Chave Pix cadastrada com sucesso!");
    modalChavePix.style.display = "none";
  } catch (err) {
    console.error("Erro ao cadastrar chave Pix:", err);
    alert("Erro ao cadastrar chave Pix. Tente novamente mais tarde.");
  }
});
