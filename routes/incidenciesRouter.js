var express = require("express");
var router = express.Router();
const validateToken = require("../middlewares/validateToken");

const incidencia_controller = require("../controllers/incidenciaController");

router.get("/", incidencia_controller.list);

router.get("/create", incidencia_controller.create_get);
router.post("/create", incidencia_controller.create_post);

router.get("/delete/:id",  incidencia_controller.delete_get);
router.post("/delete/:id",  incidencia_controller.delete_post);
router.get("/update/:id",  incidencia_controller.update_get);
router.post("/update/:id",  incidencia_controller.update_post);

//API
router.get("/APIList", validateToken.protegirRuta, incidencia_controller.incidenciaList);
router.get("/APIShow/:id", validateToken.protegirRuta, incidencia_controller.incidenciaShow);
router.get("/APIEnum", validateToken.protegirRuta, incidencia_controller.incidenciaEnum);
router.post("/APICreate", validateToken.protegirRuta, incidencia_controller.IncidenciaCreate);
router.put("/APIUpdate/:id", validateToken.protegirRuta, incidencia_controller.incidenciaUpdate);


module.exports = router;