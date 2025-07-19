const twilio = require("twilio");
require("dotenv").config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
const FROM_NUMBER = process.env.TWILIO_NUMBER;

module.exports = { client, FROM_NUMBER };


/*return client.messages
  .create({
    from: "whatsapp:" + FROM_NUMBER,
    to: "whatsapp:" + numeroFormatado,
    template: {
      name: "nome_do_template", // nome definido na sua conta Twilio
      language: { code: "pt_BR" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: dataFormatada } // se o template tem {{1}}
          ]
        }
      ]
    }
  })
*/ 