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
  // Apenas filtrar por status, sem verificar datas
  const pagos = pagamentos.filter((p) => p.status === "pago");
  const pendentes = pagamentos.filter((p) => p.status === "pendente");
  const atrasados = pagamentos.filter((p) => p.status === "atrasado");

  // Atualiza o DOM dos cards
  document.getElementById("qtd-pagos").textContent = pagos.length;
  document.getElementById(
    "desc-pagos"
  ).textContent = `${pagos.length} inquilino(s) em dia`;

  document.getElementById("qtd-pendentes").textContent = pendentes.length;
  document.getElementById(
    "desc-pendentes"
  ).textContent = `${pendentes.length} inquilino(s) com pagamento pendente`;

  document.getElementById("qtd-atrasados").textContent = atrasados.length;
  document.getElementById(
    "desc-atrasados"
  ).textContent = `${atrasados.length} inquilino(s) com pagamento(s) atrasado(s)`;
}

// Função para renderizar a lista de inquilinos na tabela (seu código, com pequenas melhorias)
async function renderInquilinosList() {
  try {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = '<tr><td colspan="5">Carregando inquilinos...</td></tr>';

    const inquilinosData = await buscarInquilinos();
    const pagamentos = await buscarPagamentos();

    // Atualiza os cards com os dados de pagamento
    atualizarCards(pagamentos);

    if (inquilinosData.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6">Nenhum inquilino encontrado</td></tr>';
      return;
    }

    tbody.innerHTML = "";

    inquilinosData.forEach((inquilino) => {
      const row = document.createElement("tr");

      // Formatar endereço completo
      const enderecoCompleto = `${inquilino.endereco}, ${inquilino.numero}${
        inquilino.complemento ? " - " + inquilino.complemento : ""
      }`;

      // Encontrar pagamento pendente/atrasado do inquilino (mês atual)
      const pagamento = pagamentos.find(
        (p) => p.inquilino_id === inquilino.inquilino_id
      );

      // Definir status padrão
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

      const vencimentoFormatado = formatDate(inquilino.due_date);

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
