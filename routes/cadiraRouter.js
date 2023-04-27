var express = require("express");
var router = express.Router();
const validateToken = require("../middlewares/validateToken");

var cadira_controller = require('../controllers/cadiracontroller');

router.get('/', cadira_controller.list);

router.get("/create", cadira_controller.create_get);
router.post("/create", cadira_controller.create_post);
router.get("/delete/:id",  cadira_controller.delete_get);
router.post("/delete/:id",  cadira_controller.delete_post);
router.get("/update/:id",  cadira_controller.update_get);
router.post("/update/:id",  cadira_controller.update_post);

//Rutes API

router.get('/APIlist', validateToken.protegirRuta, cadira_controller.CadiraList);

router.post('/APIcreate', validateToken.protegirRuta, cadira_controller.CadiraCreate);

router.get('/APIdelete/:id', validateToken.protegirRuta, cadira_controller.CadiraDelete);
router.delete('/APIdelete/:id', validateToken.protegirRuta, cadira_controller.CadiraDelete);

router.get('/APIupdate/:id', validateToken.protegirRuta, cadira_controller.CadiraUpdate);
router.put('/APIupdate/:id', validateToken.protegirRuta, cadira_controller.CadiraUpdate);


module.exports = router;
