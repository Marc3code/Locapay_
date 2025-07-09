const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();


app.use(cors()); 
app.use(express.json());


const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.send('API funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
