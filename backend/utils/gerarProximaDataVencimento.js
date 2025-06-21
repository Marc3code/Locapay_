const dayjs = require("dayjs");
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

function gerarProximaData(dataAtual) {
  return dayjs(dataAtual).utc().add(1, "month").format("YYYY-MM-DD");
}



module.exports = gerarProximaData;
