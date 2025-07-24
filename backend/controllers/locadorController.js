const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const locadorService = require("../services/locadorService");
const asaasService = require("../services/asaasService");

require("dotenv").config();
exports.registrar = async (req, res) => {
  const {
    nome,
    dataNascimento,
    email,
    senha,
    cpf_cnpj,
    telefone,
    plano,
    rendaMensal,
    rua,
    numeroEndereco,
    complemento,
    bairro,
    cep,
  } = req.body;

  try {
    console.log("🔐 Iniciando hash da senha...");
    const senha_hash = await bcrypt.hash(senha, 10);

    console.log("👤 Criando locador no banco de dados...");
    const locadorId = await locadorService.criarLocador({
      nome,
      dataNascimento,
      email,
      senha_hash,
      cpf_cnpj,
      telefone,
      rendaMensal,
      rua,
      numeroEndereco,
      complemento,
      bairro,
      cep,
    });
    console.log("✅ Locador criado com sucesso. ID:", locadorId);

    // 🔔 Notificar admin via chatbot
    console.log("📢 Enviando notificação para admin...");
    const notificacaoAdmin = await fetch(
      `${process.env.API_BASE_CHATBOT}/notifications-admin/novo-user-cadastrado`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, telefone }),
      }
    );

    if (!notificacaoAdmin.ok) {
      const erroNotificacao = await notificacaoAdmin.text();
      console.warn("⚠️ Falha ao notificar o admin:", erroNotificacao);
    } else {
      console.log("✅ Notificação para admin enviada com sucesso.");
    }

    // 📦 Registrar assinatura
    console.log("💳 Registrando assinatura do plano...");
    const respostaAssinatura = await fetch(
      `${process.env.API_BASE_ASSINATURAS}/assinaturas`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ASSINATURAS_API_KEY}`,
        },
        body: JSON.stringify({ locador_id: locadorId, plano_id: plano }),
      }
    );

    if (!respostaAssinatura.ok) {
      const erro = await respostaAssinatura.text();
      console.warn("⚠️ Assinatura não registrada:", erro);
      return res.status(201).json({
        locadorId,
        aviso:
          "Locador registrado, mas ocorreu um erro ao registrar a assinatura.",
      });
    } else {
      console.log("✅ Assinatura registrada com sucesso.");
    }

    // 🧩 Criar subconta no Asaas
    console.log("🏦 Criando subconta no Asaas...");
    const subconta = await asaasService.criarSubconta({
      nome,
      dataNascimento,
      email,
      cpf_cnpj,
      telefone,
      rendaMensal,
      rua,
      numeroEndereco,
      complemento,
      bairro,
      cep,
    });

    if (subconta.ok) {
      console.log("✅ Subconta no Asaas criada com sucesso. Salvando dados...");
      await locadorService.salvarDadosAsaas(locadorId, subconta);
      console.log("✅ Dados da subconta salvos com sucesso.");

      // 🌐 Configurar webhook para a subconta
      console.log("🔗 Configurando webhook para subconta...");
      const webhookResponse = await asaasService.configurarWebhookSubconta(
        subconta.apiKey,
        "https://backend-isolado-production.up.railway.app/asaas-events",
        email
      );

      if (webhookResponse.ok) {
        console.log("✅ Webhook configurado com sucesso para a subconta.");
      } else {
        console.warn("⚠️ Falha ao configurar webhook:", webhookResponse.error);
      }
    }

    console.log("🎉 Processo de registro finalizado com sucesso.");
    res.status(201).json({
      locadorId,
      ...(subconta.ok
        ? {}
        : {
            aviso:
              "Locador registrado, mas a subconta no Asaas não foi criada.",
          }),
    });
  } catch (err) {
    console.error("❌ Erro inesperado durante o registro:", err);
    res.status(500).json({ erro: "Erro no registro do locador." });
  }
};

exports.login = async (req, res) => {
  const { cpf_cnpj, senha } = req.body;

  const locador = await locadorService.buscarPorCpf_Cnpj(cpf_cnpj);
  if (!locador) return res.status(400).json({ erro: "E-mail não encontrado" });

  const valid = await bcrypt.compare(senha, locador.senha_hash);
  if (!valid) return res.status(401).json({ erro: "Senha incorreta" });

  const token = jwt.sign({ id: locador.id }, "seu_segredo_jwt", {
    expiresIn: "1d",
  });
  res.json({ token });
};

exports.buscarDadosGerais = async (req, res) => {
  const id = req.userId;

  const locador = await locadorService.buscarDadosGerais(id);
  if (!locador)
    return res
      .status(400)
      .json({ erro: "Locador nao encontrado não encontrado" });

  res.json(locador);
};

exports.buscarLocadorPorInquilino = async (req, res) => {
  const { inquilino_id } = req.params;

  try {
    const locador = await locadorService.buscarLocadorPorInquilino(
      inquilino_id
    );

    if (!locador) {
      return res
        .status(404)
        .json({ erro: "Locador não encontrado para esse inquilino." });
    }

    return res.json(locador);
  } catch (error) {
    console.error("Erro ao buscar locador por inquilino:", error);
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
};

exports.buscarSaldoLocador = async (req, res) => {
  const locador_id = req.userId;

  try {
    const saldo = await locadorService.buscarSaldoLocador(locador_id);

    if (!saldo) {
      return res.status(404).json({ erro: "Erro ao buscar saldo do locador" });
    }

    return res.json(saldo);
  } catch (error) {
    console.error("Erro ao buscar saldo do locador:", error);
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
};

exports.buscarRegistroTransacoes = async (req, res) => {
  const locador_id = req.userId;

  try {
    const response = await locadorService.buscarRegistroTransacoes(locador_id);

    if (!response) {
      return res
        .status(404)
        .json({ erro: "Erro ao buscar registro de transacoes do locador" });
    }

    return res.json(response.result);
  } catch (error) {
    console.error("Erro ao buscar registro de transacoes do locador:", error);
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
};

exports.buscarRegistroSaques = async (req, res) => {
  const locador_id = req.userId;

  try {
    const response = await locadorService.buscarRegistroSaques(locador_id);

    if (!response) {
      return res
        .status(404)
        .json({ erro: "Erro ao buscar registro de transacoes do locador" });
    }

    return res.json(response.result);
  } catch (error) {
    console.error("Erro ao buscar registro de transacoes do locador:", error);
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
};

exports.realizarSaque = async (req, res) => {
  const locadorId = req.userId;
  console.log("Dados recebidos na requisição de saque:", req.body);
  const valor = parseFloat(req.body.valor).toFixed(2);

  try {
    // Buscar dados gerais do locador
    const dadosLocador = await locadorService.buscarDadosGerais(locadorId);
    if (!dadosLocador) {
      return res.status(404).json({ erro: "Locador não encontrado." });
    }

    // Registrar o saque (retorna id do saque)
    const registro = await locadorService.registrarSaque(locadorId, valor);
    if (!registro.sucesso) {
      return res
        .status(500)
        .json({ erro: "Erro ao registrar solicitação de saque." });
    }
    const saqueId = registro.id;
    console.log("Saque registrado com ID:", saqueId);

    // Efetuar a transferência Pix via Asaas
    const resultadoTransferencia = await locadorService.realizarSaque(
      valor,
      dadosLocador.chave_pix,
      dadosLocador.tipo_chave_pix,
      saqueId
    );

    if (!resultadoTransferencia.sucesso) {
      console.log(
        "Transferência falhou. Atualizando status do saque para 'recusado'."
      );
      await locadorService.atualizarStatusSaque(saqueId, "recusado");
      return res.status(500).json({ erro: resultadoTransferencia.erro });
    }

    console.log(
      "Transferência realizada com sucesso. Atualizando status para 'processando'."
    );
    await locadorService.atualizarStatusSaque(saqueId, "processando");

    // Registrar a transação
    console.log("Registrando transação de saque...");
    await locadorService.registrarTransacao(locadorId, valor);

    // Buscar saldo atual
    const saldoAtual = await locadorService.buscarSaldoLocador(locadorId);
    console.log("Saldo atual encontrado:", saldoAtual);

    // Garantir que os valores estão definidos e numéricos
    const saldoTotalAtual = parseFloat(saldoAtual?.saldo_total || 0);
    const saldoBloqueadoAtual = parseFloat(saldoAtual?.saldo_bloqueado || 0);
    console.log("Saldo total atual:", saldoTotalAtual);
    console.log("Saldo bloqueado atual:", saldoBloqueadoAtual);

    // Calcular novo saldo
    const novoSaldo = {
      saldo_total: saldoTotalAtual - valor,
      saldo_bloqueado: saldoBloqueadoAtual + valor,
    };
    console.log("Novo saldo calculado:", novoSaldo);

    // Atualizar saldo
    console.log("Atualizando saldo do locador...");
    await locadorService.atualizarSaldoAtual(
      locadorId,
      novoSaldo.saldo_total,
      novoSaldo.saldo_bloqueado
    );
    console.log("Saldo atualizado com sucesso.");

    return res.status(200).json({
      mensagem: "Saque realizado com sucesso!",
      transferencia: resultadoTransferencia.dados,
    });
  } catch (err) {
    console.error("Erro no controller de saque:", err.message);
    return res.status(500).json({ erro: "Erro ao processar saque." });
  }
};

exports.buscarinfosubConta = async (req, res) => {
  const { locadorId } = req.params;

  try {
    const response = await locadorService.buscarInfoSubConta(locadorId);

    if (!response) {
      return res
        .status(404)
        .json({ erro: "Erro ao buscar informações de subconta" });
    }

    return res.json(response);
  } catch (error) {
    console.error("Erro ao buscar informações de subconta:", error);
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
};
