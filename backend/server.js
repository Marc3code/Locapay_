const express = require("express");
const db = require("./database/dbconnect.js");
const cors = require("cors");
const asaas = require("./asaas.js");
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
app.use("asaas_events", webhookRoutes)

// Webhook - Eventos do Asaas refatorado - testar;


// 📦 Imóveis
// função de busca refatorada (controller, service e routes feitos) - funcionando;
//função de adição de imoveis refatorada - testar;

// 👥 Inquilinos
//função de busca refatorada (controller, service e routes feitos) - funcionando;
//função de adição refatorada - testar
//Vinculação Inquilino-Imóvel refatorada - testar


//Cobranças
//nova classe criada para lidar com questões de cobrança e já organizada na estrutura CSR - em teste (buscar data de vencimento - ok ; falta gerar a cobrança)

// 💰 Pagamentos
//função de busca refatorada (controller, service e routes feitos) - testar;
//função de geração de cobranças pix refatorada



// ------------------ ROTAS PUT ------------------


//função de atualizar data de vencimento refatorada, porém falta ajustar a lógica, no momento está atualizando para a data informada e deve atualizar para 1 mês adiante

// ------------------ ROTAS POST ------------------



// 💳 Pagamentos / Cobranças




// Inicializa o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
