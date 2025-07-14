const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const assinaturaRoutes = require('./routes/assinaturasRoutes')
const dadosBancariosRoutes = require('./routes/dadosBancariosRoutes')
const transacoes_saldosRoutes = require('./routes/transacoes_saldo')
const saldos_locadores = require('./routes/saldos_locadoresRoutes')


app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://locapay-production.up.railway.app",
      "https://backend-isolado-production.up.railway.app"
    ],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);
app.use(express.json());


const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.send('API funcionando!');
});

app.use('/assinaturas', assinaturaRoutes);
app.use('/bk-data', dadosBancariosRoutes)
app.use('/saldos_locadores', saldos_locadores)
app.use('/transacoes_saldos', transacoes_saldosRoutes)


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
