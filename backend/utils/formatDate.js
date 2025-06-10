const dayjs = require("dayjs");

function formatDate(date) {
  return dayjs(date).format("YYYY-MM-DD");
}

module.exports = formatDate;
