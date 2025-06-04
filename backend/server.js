const express = require("express");
const db = require("./database/dbconnect.js");
const cors = require("cors");
const asaas = require("./asaas.js");
const dotenv = require("dotenv");
const imovelRoutes = require('./routes/imovelRoutes.js');
const inquilinoRoutes = require('./routes/inquilinoRoutes.js');
const cobrancaRoutes = require('./routes/cobrancaRoutes.js')

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

// 📦 Imóveis
// função de busca refatorada (controller, service e routes feitos) - funcionando;

// 👥 Inquilinos
//função de busca refatorada (controller, service e routes feitos) - em teste;

//Cobranças
//nova classe criada para lidar com questões de cobrança e já organizada na estrutura CSR - em teste

// 💰 Pagamentos
app.get("/pagamentos", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM pagamentos");
    res.json(results[0]);
  } catch (err) {
    console.error("Erro ao buscar pagamentos:", err);
    res.status(500).json({ erro: "Erro ao buscar pagamentos" });
  }
});



app.get("/link_pagamento/:inquilino_id", async (req, res) => {
  const { inquilino_id } = req.params;
  const query =
    "SELECT link_pagamento FROM pagamentos WHERE inquilino_id = ? AND status = 'pendente' LIMIT 1";

  try {
    const [results] = await db.query(query, [inquilino_id]);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nenhum pagamento pendente encontrado",
      });
    }

    res.json({
      success: true,
      paymentLink: results[0].link_pagamento,
    });
  } catch (err) {
    console.error("Erro ao buscar link de pagamento:", err);
    res.status(500).json({
      success: false,
      error: "Erro interno no servidor",
    });
  }
});



// ------------------ ROTAS PUT ------------------

app.put("/updt_data_vencimento", async (req, res) => {
  const { data_vencimento, id } = req.body;

  if (!data_vencimento || !id) {
    return res.status(400).json({ erro: "Campos obrigatórios faltando!" });
  }

  const query = `UPDATE inquilinos_imoveis SET data_vencimento = ? WHERE id = ?`;
  const values = [data_vencimento, id];

  try {
    const [results] = await db.query(query, values);

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ erro: "Nenhum registro encontrado com este ID." });
    }

    res.json({
      mensagem: "Data de vencimento atualizada com sucesso!",
      id,
      data_vencimento,
    });
  } catch (err) {
    console.error("Erro ao atualizar data de vencimento:", err);
    res.status(500).json({ erro: "Falha ao atualizar data de vencimento" });
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
