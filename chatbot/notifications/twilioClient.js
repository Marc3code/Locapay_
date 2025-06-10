const twilio = require("twilio");

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
const FROM_NUMBER = "whatsapp:+14155238886";

module.exports = { client, FROM_NUMBER };
