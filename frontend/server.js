const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, "public")));


// Redireciona a raiz para o login
app.get("/", (req, res) => {
  res.redirect("/home.html");
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
