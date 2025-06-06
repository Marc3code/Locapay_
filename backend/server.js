const express = require("express");
const db = require("./database/dbconnect.js");
const cors = require("cors");
const asaas = require("./asaas.js");
const dotenv = require("dotenv");
const imovelRoutes = require('./routes/imovelRoutes.js');
const inquilinoRoutes = require('./routes/inquilinoRoutes.js');
const cobrancaRoutes = require('./routes/cobrancaRoutes.js')
const pagamentoRoutes = require('./routes/pagamentoRoutes.js')

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

// 📦 Imóveis
// função de busca refatorada (controller, service e routes feitos) - funcionando;

// 👥 Inquilinos
//função de busca refatorada (controller, service e routes feitos) - funcionando;

//Cobranças
//nova classe criada para lidar com questões de cobrança e já organizada na estrutura CSR - em teste (buscar data de vencimento - ok ; falta gerar a cobrança)

// 💰 Pagamentos
//função de busca refatorada (controller, service e routes feitos) - funcionando;



// ------------------ ROTAS PUT ------------------

app.put("/updt_data_vencimento", async (req, res) => {
  const { data_vencimento, id } = req.body;

  if (!data_vencimento || !id) {
    return res.status(400).json({ erro: "Campos obrigatórios faltando!" });
  }

});

// ------------------ ROTAS POST ------------------

// 🏠 Imóveis
app.post("/imoveis", async (req, res) => {
  const { tipo, endereco, numero } = req.body;
  try {
    const [results] = await db.query(
      "INSERT INTO imoveis (tipo, endereco, numero) VALUES (?, ?, ? )",
      [tipo, endereco, numero]
    );
    res.status(201).json({
      id: results.insertId,
      tipo,
      endereco,
      numero,
      complemento,
    });
  } catch (err) {
    console.error("Erro ao adicionar imóvel:", err);
    res.status(500).json({ erro: "Erro ao adicionar imóvel" });
  }
});

// 👤 Inquilinos
app.post("/inquilinos", async (req, res) => {
  const ClienteData = ({ name, phone, cpfCnpj } = req.body);
  try {
    const [results] = await db.query(
      "INSERT INTO inquilinos (nome, telefone, cpfCnpj) VALUES (?, ?, ?)",
      [name, phone, cpfCnpj]
    );

    const id_asaas = await asaas.criarClienteAsaas(ClienteData);
    await db.query("UPDATE inquilinos SET id_asaas = ? WHERE id = ?", [
      id_asaas,
      results.insertId,
    ]);

    res.status(201).json({
      id: results.insertId,
      name,
      phone,
      cpfCnpj,
      id_asaas,
    });
  } catch (err) {
    console.error("Erro ao adicionar inquilino:", err);
    res.status(500).json({ erro: "Erro ao adicionar inquilino" });
  }
});

// 🔗 Vinculação Inquilino-Imóvel
app.post("/inquilinos-imoveis", async (req, res) => {
  const {
    inquilino_id,
    imovel_id,
    valor_aluguel,
    data_vencimento,
    data_inicio,
    data_fim,
    status,
    complemento,
  } = req.body;
  try {
    const [results] = await db.query(
      `INSERT INTO inquilinos_imoveis 
      (inquilino_id, imovel_id, valor_aluguel, data_vencimento, data_inicio, data_fim, status, complemento) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        inquilino_id,
        imovel_id,
        valor_aluguel,
        data_vencimento,
        data_inicio || null,
        data_fim || null,
        status || "ativo",
        complemento || null,
      ]
    );

    res.status(201).json({
      id: results.insertId,
      inquilino_id,
      imovel_id,
      valor_aluguel,
      data_vencimento,
      data_inicio,
      data_fim,
      status,
      complemento,
    });
  } catch (err) {
    console.error("Erro ao vincular inquilino a imóvel:", err);
    res.status(500).json({ erro: "Erro ao vincular inquilino a imóvel" });
  }
});

//iniciado ate aqui a refatoração

// 💳 Pagamentos / Cobranças
app.post("/pagamentos", async (req, res) => {

  const id_asaas = req.body.id_asaas;
  const valor = req.body.valor;
  const data_vencimento = req.body.data_vencimento;
  const inquilino_id = req.body.inquilino_id;

  try {
    const pagamento = await asaas.gerarPagamentoPix(id_asaas, valor, data_vencimento);

    const query = `INSERT INTO pagamentos (inquilino_id, asaas_payment_id, due_date, payment_date, amount, link_pagamento) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [
      inquilino_id,
      pagamento.id,
      data_vencimento,
      null,
      valor,
      pagamento.invoiceUrl,
    ];

    await db.query(query, values);

   
    res.json(pagamento);
  } catch (err) {
    console.error("Erro ao criar cobrança ou registrar no BD:", err);
    res.status(500).json({ erro: "Erro ao criar cobrança ou registrar no BD" });
  }
});


// 📩 Webhook - Eventos do Asaas
app.post("/asaas_events", async (req, res) => {
  res.status(200).send("ok");

  const event = req.body.event;
  console.log("Evento recebido:", event);

  if (event === "PAYMENT_RECEIVED") {
    const payment_id = req.body.payment?.id;
    if (!payment_id)
      return res.status(500).json({ pay_id: "ID do pagamento não encontrado" });

    try {
      const query = `UPDATE pagamentos SET STATUS = 'pago' WHERE asaas_payment_id = ?`;
      await db.query(query, payment_id);
      console.log("Status do pagamento atualizado com sucesso");
    } catch (err) {
      console.error("Erro ao atualizar status do pagamento:", err);
      return res
        .status(500)
        .json({ erro: "Erro ao atualizar status do pagamento" });
    }
  } else if (event === "PAYMENT_CREATED") {
    console.log("evento: ", event);
  } else if (event === "PAYMENT_OVERDUE") {
    const payment_id = req.body.payment?.id;
    try {
      const query = `UPDATE pagamentos SET STATUS = "atrasado" WHERE asaas_payment_id = ?`;
      await db.query(query, payment_id);
      console.log("Status do pagamento atualizado com sucesso");
    } catch (err) {
      console.error("Erro ao atualizar status do pagamento:", err);
      return res
        .status(500)
        .json({ erro: "Erro ao atualizar status do pagamento" });
    }
  }
});

// Inicializa o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
