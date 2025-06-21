const dayjs = require("dayjs");

function formatDate(date) {
  return dayjs(date).utc().format("YYYY-MM-DD");
}

module.exports = formatDate;
