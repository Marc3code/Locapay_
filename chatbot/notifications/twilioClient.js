const twilio = require("twilio");
require("dotenv").config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
const FROM_NUMBER = process.env.TWILIO_NUMBER;

module.exports = { client, FROM_NUMBER };
