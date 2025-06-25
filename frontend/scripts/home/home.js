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

// Função para renderizar lista de inquilinos
async function renderTenantsList() {
  const mesAtual = new Date().getMonth() + 1;

  try {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = '<tr><td colspan="5">Carregando inquilinos...</td></tr>';

    const inquilinosData = await buscarInquilinos();
    const pagamentos = await buscarPagamentos();
    console.log(pagamentos);

    console.log(inquilinosData);
    if (inquilinosData.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6">Nenhum inquilino encontrado</td></tr>';
      return;
    }

    tbody.innerHTML = "";

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    inquilinosData.forEach((tenant) => {
      const row = document.createElement("tr");

      // Formatar endereço completo
      const enderecoCompleto = `${tenant.endereco}, ${tenant.numero}${
        tenant.complemento ? " - " + tenant.complemento : ""
      }`;

      
      const pagamentoPendente = pagamentos.find(
        (p) => p.inquilino_id === tenant.id
      ) || [];

      // Status de pagamento baseado na existência do pagamento pendente
      const paymentStatus = pagamentoPendente ? "pendente" : "pago";

      // Calcular status de pagamento
      const vencimento = new Date(tenant.data_vencimento);
      vencimento.setHours(0, 0, 0, 0);

      row.innerHTML = `
        <td>
          <div class="tenant-info">
            <div class="tenant-avatar">${getInitials(tenant.nome)}</div>
            <div>
              <div class="tenant-name">${tenant.nome}</div>
              <div class="tenant-property">${tenant.telefone}</div>
            </div>
          </div>
        </td>
        <td>${enderecoCompleto}</td>
        <td>R$ ${parseFloat(tenant.valor_aluguel)
          .toFixed(2)
          .replace(".", ",")}</td>
        <td><span class="status ${paymentStatus}">${pagamentoPendente.status}</span></td>
        <td class="${
          paymentStatus === "overdue" ? "overdue-date" : "due-date"
        }">
          ${formatDate(tenant.data_vencimento)}
        </td>
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
  renderTenantsList();
});
