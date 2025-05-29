exports.formatarNumeroWhatsapp = (numeroRaw) => {
  let numero = numeroRaw.replace("whatsapp:", "").trim();

  if (!numero.startsWith("+55")) {
    numero = "+55" + numero;
  }

  const ddd = numero.slice(3, 5);
  let num = numero.slice(5);

  if (num.length === 8) {
    num = "9" + num;
  } else if (num.length === 9 && num[0] !== "9") {
    num = "9" + num.slice(1);
  }

  return `+55${ddd}${num}`;
};
