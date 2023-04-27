var express = require("express");
var router = express.Router();
const validateToken = require("../middlewares/validateToken");

const reserva_controller = require("../controllers/reservaController");



router.get("/", reserva_controller.list);

router.get("/create", reserva_controller.create_get);
router.post("/create", reserva_controller.create_post);

router.get("/delete/:id", reserva_controller.delete_get);
router.post("/delete/:id", reserva_controller.delete_post);
    
router.get("/update/:id", reserva_controller.update_get);
router.post("/update/:id", reserva_controller.update_post);

//API

router.get('/APIlist', validateToken.protegirRuta, reserva_controller.ReservaList);

router.post('/APIcreate', validateToken.protegirRuta, reserva_controller.ReservaCreate);

router.get('/APIdelete/:id', validateToken.protegirRuta, reserva_controller.ReservaDelete);
router.delete('/APIdelete/:id', validateToken.protegirRuta, reserva_controller.ReservaDelete);

router.get('/APIupdate/:id', validateToken.protegirRuta, reserva_controller.ReservaUpdate);
router.put('/APIupdate/:id', validateToken.protegirRuta, reserva_controller.ReservaUpdate);




module.exports=router;