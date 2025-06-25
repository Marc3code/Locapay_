const agendarTarefa = require("../agendarTarefa");
const lembrete_pagamento = require("../../tarefas/lembrete_pagamento");

// Roda todo dia às 12h
agendarTarefa("0 12 * * *", lembrete_pagamento);


