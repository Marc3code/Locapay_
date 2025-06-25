const agendarTarefa = require("../agendarTarefa");
const lembrete_pagamento = require("../../tarefas/lembrete_pagamento");

// Roda todo dia
agendarTarefa("02 * * * *", lembrete_pagamento);


