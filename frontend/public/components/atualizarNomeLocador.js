import { buscarDadosGerais } from "../scripts/service";

async function atualizarNomeLocador() {
  try {
    // Supondo que você tenha o ID do locador guardado, por exemplo no localStorage
    const locadorId = localStorage.getItem("locador_id");
    if (!locadorId) {
      console.warn("ID do locador não encontrado");
      return;
    }

    const dadosLocador = await buscarDadosGerais(locadorId)
    if (dadosLocador && dadosLocador.nome) {
      const nomeSpan = document.getElementById("nome-locador");
      if (nomeSpan) {
        nomeSpan.textContent = dadosLocador.nome;
      }
      // Opcional: atualizar as iniciais do avatar
      const avatarDiv = document.querySelector(".inquilino-avatar");
      if (avatarDiv) {
        const iniciais = dadosLocador.nome
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase();
        avatarDiv.textContent = iniciais;
      }
    }
  } catch (error) {
    console.error("Erro ao atualizar nome do locador:", error);
  }
}

// Rodar a função quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", atualizarNomeLocador);
