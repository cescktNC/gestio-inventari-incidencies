var express = require("express");
var router = express.Router();

var ticket_controller = require('../controllers/ticketController');

router.get('/:idSessio', ticket_controller.list);
router.get("/create", ticket_controller.create);
router.get("/mostrar/:idTicket", ticket_controller.show);

module.exports = router;