export function createHeader() {
    const header = document.createElement("header");
    header.className = "header";
    header.innerHTML = `
      <h1>Olá, Marcos!</h1>
      <nav class="nav">
        <a href="dashboard.html">Dashboard</a>
        <a href="imoveis.html">Imóveis</a>
        <a href="inquilinos.html">Inquilinos</a>
        <a href="financeiro.html">Financeiro</a>
      </nav>
    `;
    return header;
  }
