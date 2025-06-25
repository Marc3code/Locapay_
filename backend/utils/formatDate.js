const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");

dayjs.extend(utc); 

function formatDate(date) {
  return dayjs(date).utc().format("YYYY-MM-DD");
}

module.exports = formatDate;
