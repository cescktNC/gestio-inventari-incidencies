var express = require("express");
var router = express.Router();

const reserva_controller = require("../controllers/reservaController");



router.get("/", reserva_controller.list);

router.get("/create", reserva_controller.create_get);
router.post("/create", reserva_controller.create_post);

router.get("/delete/:id", reserva_controller.delete_get);
router.post("/delete/:id", reserva_controller.delete_post);
    
router.get("/update/:id", reserva_controller.update_get);
router.post("/update/:id", reserva_controller.update_post);




module.exports=router;