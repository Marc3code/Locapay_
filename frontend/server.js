const express = require("express");
const path = require("path");
const app = express();

// Serve a pasta puuuublic
app.use(express.static(path.join(__dirname, "frontend", "public")));

// Rota raiz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "public", "login.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
