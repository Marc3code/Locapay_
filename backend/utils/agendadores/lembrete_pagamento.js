const agendarTarefa = require("../agendarTarefa");
const lembrete_pagamento = require("../../tarefas/lembrete_pagamento");

// Roda todo dia a cada 2 minutos
agendarTarefa("*/2 * * * *", lembrete_pagamento);


