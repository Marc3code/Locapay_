const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Define a pasta 'public' como estática
app.use(express.static(path.join(__dirname, "public")));

// Se quiser uma rota raiz para redirecionar
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
