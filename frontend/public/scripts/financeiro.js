import {
  buscarSaldo,
  buscarMovimentações,
  buscarSaques,
  cadastrarChavePix,
  buscarDadosBancarios,
  realizarSaque,
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
btnConfirmar.addEventListener("click", async () => {
  const valor = parseFloat(inputValor.value);
  if (isNaN(valor) || valor <= 0) {
    alert("Informe um valor válido para saque.");
    return;
  }

  try {
    const saldo = await buscarSaldo();
    const saldoDisponivel = parseFloat(saldo.saldo_total ?? 0);
    const saldoBloqueado = parseFloat(saldo.saldo_bloqueado ?? 0);

    // Se já houver valor bloqueado, impedir novo saque
    if (saldoBloqueado > 0) {
      alert(
        `Você já possui um saque em processamento no valor de ${formatarValor(
          saldoBloqueado
        )}. Aguarde a conclusão para solicitar um novo saque.`
      );
      return;
    }

    if (valor > saldoDisponivel) {
      alert(
        `Valor do saque excede o saldo disponível de ${formatarValor(
          saldoDisponivel
        )}.`
      );
      return;
    }

    const dadosBancarios = await buscarDadosBancarios();
    const chave_pix = dadosBancarios.chave_pix;
    const saque = await realizarSaque(valor, chave_pix);

    if (saque?.erro) {
      alert(
        `Erro ao realizar saque: ${saque.erro}.\nEntre em contato com o suporte.`
      );
      return;
    }

    alert(`Saque de ${formatarValor(valor)} solicitado com sucesso!`);
    modalSaque.style.display = "none";

    // Atualiza saldos e tabelas após saque
    await atualizarSaldos();
    await renderizarSaques();
    await renderizarMovimentacoes();
  } catch (err) {
    console.error("Erro ao realizar saque:", err);
    alert("Erro ao realizar saque. Tente novamente mais tarde.");
  }
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


// Função para formatar telefone para o padrão +55...
function formatarTelefone(chave) {
  const apenasNumeros = chave.replace(/\D/g, "");
  if (apenasNumeros.length === 11) {
    return `+55${apenasNumeros}`;
  }
  return chave; // retorna como está se não tiver 11 dígitos
}


// Salvar chave Pix
btnSalvarChave.addEventListener("click", async () => {
  let chave = inputChavePix.value.trim();
  const tipo = document.getElementById("tipoChavePix").value;

  if (!chave || !tipo) {
    alert("Por favor, preencha a chave Pix e o tipo.");
    return;
  }

  // Formatar chave se for telefone
  if (tipo === "PHONE") {
    chave = formatarTelefone(chave);
  }

  try {
    const cadastro = await cadastrarChavePix(chave, tipo);

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
