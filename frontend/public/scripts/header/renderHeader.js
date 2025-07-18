import atualizarNomeLocador from "./atualizarNomeLocador.js";

export async function carregarHeader(paginaAtiva) {
  try {
    const response = await fetch("./components/header.html");
    if (!response.ok) throw new Error("Erro ao carregar header");

    const html = await response.text();
    const headerContainer = document.createElement("div");
    headerContainer.innerHTML = html;

    const activeLink = headerContainer.querySelector(
      `.nav-link[data-page="${paginaAtiva}"]`
    );
    if (activeLink) activeLink.classList.add("active");

    document.body.prepend(headerContainer.firstElementChild);

    // Chama a função para atualizar o nome do locador no header
    atualizarNomeLocador();
  } catch (err) {
    console.error("Erro ao injetar header:", err);
  }
}

