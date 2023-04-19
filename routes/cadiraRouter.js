var express = require("express");
var router = express.Router();

var cadira_controller = require('../controllers/cadiracontroller');

router.get('/', cadira_controller.list);

router.get("/create", cadira_controller.create_get);
router.post("/create", cadira_controller.create_post);
router.get("/delete/:id",  cadira_controller.delete_get);
router.post("/delete/:id",  cadira_controller.delete_post);
router.get("/update/:id",  cadira_controller.update_get);
router.post("/update/:id",  cadira_controller.update_post);

//Rutes API

router.get('/APIlist', cadira_controller.CadiraList);

router.post('/APIcreate', cadira_controller.CadiraCreate);

router.get('/APIdelete/:id', cadira_controller.CadiraDelete);
router.delete('/APIdelete/:id', cadira_controller.CadiraDelete);

router.get('/APIupdate/:id', cadira_controller.CadiraUpdate);
router.put('/APIupdate/:id', cadira_controller.CadiraUpdate);


module.exports = router;
