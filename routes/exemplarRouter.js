var express = require("express");
var router = express.Router();

const exemplar_controller = require("../controllers/exemplarController");



router.get("/", exemplar_controller.list);

router.get("/create", exemplar_controller.create_get);
router.post("/create", exemplar_controller.create_post);
router.get("/update/:id",  exemplar_controller.update_get);
router.post("/update/:id",  exemplar_controller.update_post);
router.get("/show/:id", exemplar_controller.show);

//API

router.get('/APIlist', exemplar_controller.exemplarList);
<<<<<<< HEAD
router.get('/APIshow/:id', exemplar_controller.exemplarSowh);
router.post('/APICreate', exemplar_controller.exemplarCreate);
router.put('/APIUpdate/:id', exemplar_controller.exemplarUpdate);
=======
>>>>>>> 7934a22 (Solucio conflictes)


module.exports = router;