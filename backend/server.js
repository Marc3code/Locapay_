const express = require("express");
const db = require("./database/dbconnect.js");
const cors = require("cors");
const asaas = require("./services/asaasService.js");
const dotenv = require("dotenv");
const imovelRoutes = require('./routes/imovelRoutes.js');
const inquilinoRoutes = require('./routes/inquilinoRoutes.js');
const cobrancaRoutes = require('./routes/cobrancaRoutes.js')
const pagamentoRoutes = require('./routes/pagamentoRoutes.js')
const webhookRoutes = require('./routes/webhookRoutes.js')

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);
app.use(express.json());

// Rota básica
app.get("/", (req, res) => {
  res.send("API rodando!");
});

// ------------------ ROTAS GET ------------------

app.use("/imoveis", imovelRoutes);
app.use("/inquilinos", inquilinoRoutes);
app.use("/cobrancas", cobrancaRoutes);
app.use("/pagamentos", pagamentoRoutes);
app.use("/asaas_events", webhookRoutes)

// Webhook - Eventos do Asaas refatorado - funcionando;


// 📦 Imóveis
//função de adição de imoveis refatorada - funcionando;

// 👥 Inquilinos
//Vinculação Inquilino-Imóvel refatorada - funcionando
//busca de todas as informações de inquilinos e imoveis vinculadas - funcionando

//Cobranças
//geração de cobrança pix - funcionando
//buscar todos os pagamentos pendentes - testar

//função de atualizar data de vencimento refatorada, porém falta ajustar a lógica, no momento está atualizando para a data informada e deve atualizar para 1 mês adiante


// 💰 Pagamentos
//buscar todos os pagamentos - funcionando
//buscar links de pagamento - funcionando
//atualizar status de pagamento - testar





// Inicializa o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
