const cron = require("node-cron");

function agendarTarefa(expressaoCron, tarefa) {
  console.log("🕒 Horário atual do sistema:", new Date().toString());

  if (!cron.validate(expressaoCron)) {
    console.error("❌ Expressão cron inválida:", expressaoCron);
    return;
  }

  console.log(`🗓️ Agendando tarefa para '${expressaoCron}' com timezone 'America/Sao_Paulo'`);

  cron.schedule(expressaoCron, () => {
    console.log("🚀 Tarefa executada em:", new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }));
    tarefa();
  }, {
    timezone: "America/Sao_Paulo"
  });
}

module.exports = agendarTarefa;
