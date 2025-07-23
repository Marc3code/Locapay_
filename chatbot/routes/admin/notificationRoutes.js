const express = require("express");
const router = express.Router();
const notificationController = require("../../controllers/admin/notificationsController");

router.post('/novo-user-cadastrado', notificationController.enviarNotificacaoNovoUsuario)

module.exports = router;