var express = require("express");
var router = express.Router();
const validateToken = require("../middlewares/validateToken");

const exemplar_controller = require("../controllers/exemplarController");



router.get("/", exemplar_controller.list);

router.get("/create", exemplar_controller.create_get);
router.post("/create", exemplar_controller.create_post);
router.get("/update/:id",  exemplar_controller.update_get);
router.post("/update/:id",  exemplar_controller.update_post);
router.get("/show/:id", exemplar_controller.show);

//API

router.get('/APIlist', validateToken.protegirRuta, exemplar_controller.exemplarList);
router.get('/APIshow/:id', validateToken.protegirRuta, exemplar_controller.exemplarSowh);
router.post('/APICreate', validateToken.protegirRuta, exemplar_controller.exemplarCreate);
router.put('/APIUpdate/:id', validateToken.protegirRuta, exemplar_controller.exemplarUpdate);

module.exports = router;