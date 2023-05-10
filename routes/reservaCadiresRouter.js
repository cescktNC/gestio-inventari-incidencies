var express = require("express");
var router = express.Router();
const validateToken = require("../middlewares/validateToken");

var reservaCadira_controller = require('../controllers/reservaCadiraController');

router.get('/:id', reservaCadira_controller.list);

//router.get("/create/:id/:cadira", reservaCadira_controller.create);
router.get("/delete/:id", reservaCadira_controller.delete);

router.get("/create/:id/:cadiresReservadesProvisionalment/:usuariId", reservaCadira_controller.create);
router.get("/reserva/:id/:cadira/:cadiresReservadesProvisionalment", reservaCadira_controller.reservaProvisional);
router.get("/eliminarreserva/:id/:cadira/:cadiresReservadesProvisionalment", reservaCadira_controller.eliminarReservaProvisional);

router.get("/APIlist/:id", validateToken.protegirRuta, reservaCadira_controller.APIlist);
router.get("/APIcreate/:id/:cadiresReservadesProvisionalment/:usuariId", reservaCadira_controller.APIcreate);
router.get("/APIcreateProvisional/:id/:cadira/:cadiresReservadesProvisionalment", validateToken.protegirRuta, reservaCadira_controller.APIreservaProvisional);
router.get("/APIdeleteProvisional/:id/:cadira/:cadiresReservadesProvisionalment", validateToken.protegirRuta, reservaCadira_controller.APieliminarReservaProvisional);

// router.post("/create", cadira_controller.create_post);
// router.get("/delete/:id",  cadira_controller.delete_get);
// router.post("/delete/:id",  cadira_controller.delete_post);
// router.get("/update/:id",  cadira_controller.update_get);
// router.post("/update/:id",  cadira_controller.update_post);

module.exports = router;