var express = require("express");
var router = express.Router();

const planta_controller = require("../controllers/plantaController");



router.get("/", planta_controller.list);

router.get("/create", planta_controller.create_get);
router.post("/create", planta_controller.create_post);

router.get("/delete/:id", planta_controller.delete_get);
router.post("/delete/:id", planta_controller.delete_post);
    
router.get("/update/:id", planta_controller.update_get);
router.post("/update/:id", planta_controller.update_post);




module.exports=router;