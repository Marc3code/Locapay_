const agendarTarefa = require("../agendarTarefa");
const gerarCobrancasDoMes = require("../../tarefas/gerarCobrancasDoMes");

// Roda no 1º dia do mês às 01:00
agendarTarefa("57 12 * * *", gerarCobrancasDoMes);


