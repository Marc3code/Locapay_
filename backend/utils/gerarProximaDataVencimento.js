const dayjs = require("dayjs");

function gerarProximaData(dataAtual) {
  return dayjs(dataAtual).add(1, "month").format("YYYY-MM-DD");
}



module.exports = gerarProximaData;
