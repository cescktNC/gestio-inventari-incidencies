var express = require("express");
var router = express.Router();
const validateToken = require("../middlewares/validateToken");

const localitzacio_controller = require("../controllers/localitzacioController");

router.get("/", localitzacio_controller.list);

router.get("/create", localitzacio_controller.create_get);
router.post("/create", localitzacio_controller.create_post);
router.get("/delete/:id",  localitzacio_controller.delete_get);
router.post("/delete/:id",  localitzacio_controller.delete_post);
router.get("/update/:id",  localitzacio_controller.update_get);
router.post("/update/:id",  localitzacio_controller.update_post);

//Rutes API

router.get('/APIlist', validateToken.protegirRuta, localitzacio_controller.localitzacioList);
router.get('/APIshow/:id', validateToken.protegirRuta, localitzacio_controller.localitzacioSowh);
router.get('/APIAllList', validateToken.protegirRuta, localitzacio_controller.localitzacioAllLlist);

router.post('/APIcreate', validateToken.protegirRuta, localitzacio_controller.localitzacioCreate);

router.delete('/APIdelete/:id', validateToken.protegirRuta, localitzacio_controller.LocalitzacioDelete);

router.put('/APIupdate/:id', validateToken.protegirRuta, localitzacio_controller.localitzacioUpdate);

module.exports = router;