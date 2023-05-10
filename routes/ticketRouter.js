var express = require("express");
var router = express.Router();
const validateToken = require("../middlewares/validateToken");

var ticket_controller = require('../controllers/ticketController');

router.get('/:idSessio', ticket_controller.list);
router.get("/create", ticket_controller.create);
router.get("/mostrar/:idTicket", ticket_controller.show);

//API

router.get('/APIlist/:idSessio', validateToken.protegirRuta, ticket_controller.TicketList);
router.get('/APIShow/:idTicket', validateToken.protegirRuta, ticket_controller.ShowTicket);

module.exports = router;