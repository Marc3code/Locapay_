const express = require("express");
const dotenv = require("dotenv");
const webhookRoutes = require("./routes/webhook");
const notificationRoutes = require('./routes/notificationRoutes')

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/notifications', notificationRoutes);
app.use("/", webhookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
