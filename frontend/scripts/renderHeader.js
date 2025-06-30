// scripts/injectHeader.js
export async function carregarHeader(paginaAtiva) {
  const response = await fetch("../components/header.html");
  const html = await response.text();
  const headerContainer = document.createElement("div");
  headerContainer.innerHTML = html;

  // Marca o menu ativo
  const activeLink = headerContainer.querySelector(
    `.nav-link[data-page="${paginaAtiva}"]`
  );
  if (activeLink) activeLink.classList.add("active");

  document.body.prepend(headerContainer.firstElementChild);
}
