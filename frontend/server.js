const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.redirect("/login.html");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
