import { buscarInquilinos, buscarPagamentos } from "./service.js";

// Função para gerar iniciais do nome
function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// Função para formatar data (YYYY-MM-DD para DD/MM/YYYY)
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
}

function atualizarCards(pagamentos) {
  const statusPorInquilino = {};

  pagamentos.forEach((pagamento) => {
    const id = pagamento.inquilino_id;
    const status = pagamento.status;

    if (!statusPorInquilino[id]) {
      statusPorInquilino[id] = new Set();
    }

    statusPorInquilino[id].add(status);
  });

  let qtdEmDia = 0;
  let qtdPendentes = 0;
  let qtdAtrasados = 0;

  for (const statusSet of Object.values(statusPorInquilino)) {
    if (statusSet.has("atrasado")) {
      qtdAtrasados++;
    } else if (statusSet.has("pendente")) {
      qtdPendentes++;
    } else {
      qtdEmDia++;
    }
  }

  document.getElementById("qtd-em-dia").textContent = qtdEmDia;
  document.getElementById(
    "desc-pagos"
  ).textContent = `${qtdEmDia} inquilino(s) em dia`;

  document.getElementById("qtd-pendentes").textContent = qtdPendentes;
  document.getElementById(
    "desc-pendentes"
  ).textContent = `${qtdPendentes} inquilino(s) com pagamento pendente`;

  document.getElementById("qtd-atrasados").textContent = qtdAtrasados;
  document.getElementById(
    "desc-atrasados"
  ).textContent = `${qtdAtrasados} inquilino(s) com pagamento(s) atrasado(s)`;
}

async function renderInquilinosList() {
  try {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = '<tr><td colspan="5">Carregando inquilinos...</td></tr>';

    const inquilinosData = await buscarInquilinos();
    const todosPagamentos = await buscarPagamentos();

    // Atualiza os cards com TODOS os pagamentos
    atualizarCards(todosPagamentos);

    // Filtra só os pagamentos do mês atual para exibir na tabela
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    const pagamentosDoMes = todosPagamentos.filter((p) => {
      const venc = new Date(p.due_date);
      return venc.getMonth() === mesAtual && venc.getFullYear() === anoAtual;
    });

    if (inquilinosData.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6">Nenhum inquilino encontrado</td></tr>';
      return;
    }

    tbody.innerHTML = "";

    inquilinosData.forEach((inquilino) => {
      const row = document.createElement("tr");
      row.style.cursor = "pointer"; // Indica que a linha é clicável

      row.addEventListener("click", () => {
        window.location.href = `detalhe_inquilino.html?inquilino_id=${inquilino.inquilino_id}`;
      });
      
      const enderecoCompleto = `${inquilino.endereco}, ${inquilino.numero}${
        inquilino.complemento ? " - " + inquilino.complemento : ""
      }`;

      const pagamento = pagamentosDoMes.find(
        (p) => p.inquilino_id === inquilino.inquilino_id
      );

      let statusText = "Pago";
      let statusClass = "pago";
      let vencimentoClass = "due-date";

      if (pagamento) {
        if (pagamento.status === "pendente") {
          statusText = "Pendente";
          statusClass = "pendente";
        } else if (pagamento.status === "atrasado") {
          statusText = "Atrasado";
          statusClass = "atrasado";
          vencimentoClass = "overdue-date";
        }
      }

      const vencimentoFormatado = pagamento
        ? formatDate(pagamento.due_date)
        : "-";

      row.innerHTML = `
        <td>
          <div class="inquilino-info">
            <div class="inquilino-avatar">${getInitials(inquilino.nome)}</div>
            <div>
              <div class="inquilino-name">${inquilino.nome}</div>
              <div class="inquilino-property">${inquilino.telefone}</div>
            </div>
          </div>
        </td>
        <td>${enderecoCompleto}</td>
        <td>R$ ${parseFloat(inquilino.valor_aluguel)
          .toFixed(2)
          .replace(".", ",")}</td>
        <td><span class="status ${statusClass}">${statusText}</span></td>
        <td class="${vencimentoClass}">${vencimentoFormatado}</td>
      `;

      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Erro ao renderizar inquilinos:", error);
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = '<tr><td colspan="6">Erro ao carregar dados</td></tr>';
  }
}

// Inicializar a aplicação
document.addEventListener("DOMContentLoaded", () => {
  renderInquilinosList();
});
