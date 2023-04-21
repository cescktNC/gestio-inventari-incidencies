var express = require("express");
var router = express.Router();

const localitzacio_controller = require("../controllers/localitzacioController");



router.get("/", localitzacio_controller.list);

router.get("/create", localitzacio_controller.create_get);
router.post("/create", localitzacio_controller.create_post);
router.get("/delete/:id",  localitzacio_controller.delete_get);
router.post("/delete/:id",  localitzacio_controller.delete_post);
router.get("/update/:id",  localitzacio_controller.update_get);
router.post("/update/:id",  localitzacio_controller.update_post);

//Rutes API

router.get('/APIlist', localitzacio_controller.LocalitzacioList);
router.get('/APIshow/:id', localitzacio_controller.localitzacioSowh);
router.get('/APIAllList', localitzacio_controller.localitzacioAllLlist);

router.post('/APIcreate', localitzacio_controller.LocalitzacioCreate);

router.get('/APIdelete/:id', localitzacio_controller.LocalitzacioDelete);
router.delete('/APIdelete/:id', localitzacio_controller.LocalitzacioDelete);

router.get('/APIupdate/:id', localitzacio_controller.LocalitzacioUpdate);
router.put('/APIupdate/:id', localitzacio_controller.LocalitzacioUpdate);

//API

router.get('/APIshow/:id', localitzacio_controller.localitzacioSowh);


module.exports = router;