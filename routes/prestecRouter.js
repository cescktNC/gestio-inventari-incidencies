var express = require("express");
var router = express.Router();
const validateToken = require("../middlewares/validateToken");


const prestec_controller = require("../controllers/prestecController");

router.get("/", prestec_controller.list);

router.get("/create", prestec_controller.create_get);
router.post("/create", prestec_controller.create_post);

router.get("/delete/:id", prestec_controller.delete_get);
router.post("/delete/:id", prestec_controller.delete_post);
    
router.get("/update/:id", prestec_controller.update_get);
router.post("/update/:id", prestec_controller.update_post);

//API

router.get('/APIlist', validateToken.protegirRuta, prestec_controller.prestecList);

router.get('/APIPendent', validateToken.protegirRuta, prestec_controller.prestecCount);
router.get('/APIShow/:id', validateToken.protegirRuta, prestec_controller.prestecShow);
router.get('/APIEstats', validateToken.protegirRuta, prestec_controller.estats);
router.post('/APIcreate', validateToken.protegirRuta, prestec_controller.prestecCreate);
router.put('/APIUpdate/:id', validateToken.protegirRuta, prestec_controller.prestecUpdate);



module.exports=router;