var express = require("express");
var router = express.Router();
const validateToken = require("../middlewares/validateToken");


const centre_controller = require("../controllers/centreController");



router.get("/", centre_controller.list);

router.get("/create", centre_controller.create_get);
router.post("/create", centre_controller.create_post);

router.get("/delete/:id",  centre_controller.delete_get);
router.post("/delete/:id",  centre_controller.delete_post);

router.get("/update/:id",  centre_controller.update_get);
router.post("/update/:id",  centre_controller.update_post);

//Rutes API

router.get('/APIlist', validateToken.protegirRuta, centre_controller.CentreList);

router.get('/APIshow/:id', validateToken.protegirRuta, centre_controller.CentreSowh);


router.post('/APIcreate', validateToken.protegirRuta, centre_controller.CentreCreate);

router.delete('/APIdelete/:id', validateToken.protegirRuta, centre_controller.CentreDelete);

router.put('/APIupdate/:id', validateToken.protegirRuta, centre_controller.CentreUpdate);


module.exports = router;