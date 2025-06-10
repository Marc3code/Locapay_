const cron = require("node-cron");

function agendarTarefa(expressaoCron, tarefa) {
  if (!cron.validate(expressaoCron)) {
    console.error("❌ Expressão cron inválida:", expressaoCron);
    return;
  }

  console.log(`🗓️ Agendando tarefa para '${expressaoCron}'`);
  cron.schedule(expressaoCron, tarefa);
}

module.exports = agendarTarefa;
