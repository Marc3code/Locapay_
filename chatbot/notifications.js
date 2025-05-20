require("dotenv").config();

const twilio = require("twilio");

const SID = "ACd9bcd1d260d64b2e6b84efd5bf6873ec";
const TOKEN = "e710b23e1245f2e9d2ec64769173e386";
const TWILIO_NUMBER = "whatsapp:+14155238886";

const client = twilio(SID, TOKEN);

const enviarNotificacaoCobrancaDoDia = (data, telefone) => {
  client.messages.create(
    {
      from: TWILIO_NUMBER,
      to: "whatsapp:" + telefone,
      body: `Sua fatura do aluguel com vencimento no dia ${data} foi gerada e já está disponível para pagamento. Para pagar agora é só digitar 1.`,
    },
    function (err, message) {
      if (err) {
        console.log(err.message);
      } else {
        console.log("Mensagem enviada com SID:", message.sid);
      }
    }
  );
};


const enviarNotificacaoCobranca3DiasAntes = () =>{

}

const enviarNotificacaoAtraso = () => {
  
}

module.exports = { enviarNotificacaoCobrancaDoDia };
