var express = require("express");
var router = express.Router();

const centre_controller = require("../controllers/centreController");



router.get("/", centre_controller.list);

router.get("/create", centre_controller.create_get);
router.post("/create", centre_controller.create_post);

router.get("/delete/:id",  centre_controller.delete_get);
router.post("/delete/:id",  centre_controller.delete_post);

router.get("/update/:id",  centre_controller.update_get);
router.post("/update/:id",  centre_controller.update_post);

//Rutes API

router.get('/APIlist', centre_controller.CentreList);

router.get('/APIshow/:id', centre_controller.CentreSowh);


router.post('/APIcreate', centre_controller.CentreCreate);

router.delete('/APIdelete/:id', centre_controller.CentreDelete);

router.put('/APIupdate/:id', centre_controller.CentreUpdate);


module.exports = router;