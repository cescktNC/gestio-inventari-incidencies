var express = require("express");
var express = require("express");
var router = express.Router();
var upload = require("../libs/storage");

const planta_controller = require("../controllers/plantaController");

router.get("/", planta_controller.list);

router.get("/create", planta_controller.create_get);
router.post("/create", upload.single('planol'), planta_controller.create_post);

router.get("/delete/:id", planta_controller.delete_get);
router.post("/delete/:id", planta_controller.delete_post);

router.get("/update/:id", planta_controller.update_get);
router.post("/update/:id", upload.single("planol"), planta_controller.update_post);

//API
router.get('/APIshow/:id', planta_controller.PlantaSowh)

module.exports = router;
