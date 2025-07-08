const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, "public")));

// Redireciona a raiz para o login
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

// Para qualquer outra rota não tratada, tenta enviar o arquivo correspondente (útil para rotas como /components/header.html)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", req.path), (err) => {
    if (err) {
      res.status(404).send("Arquivo não encontrado");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
