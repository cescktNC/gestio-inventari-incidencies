var express = require("express");
var router = express.Router();

const incidencia_controller = require("../controllers/incidenciaController");



router.get("/", incidencia_controller.list);

router.get("/create", incidencia_controller.create_get);
router.post("/create", incidencia_controller.create_post);




module.exports = router;