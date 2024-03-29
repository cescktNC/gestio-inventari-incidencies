var express = require("express");
var router = express.Router();
const validateToken = require("../middlewares/validateToken");

const sessio_controller = require("../controllers/sessioController");

router.get("/", sessio_controller.list);

router.get("/create", sessio_controller.create_get);
router.post("/create", sessio_controller.create_post);

router.get("/delete/:id",  sessio_controller.delete_get);
router.post("/delete/:id",  sessio_controller.delete_post);

router.get("/update/:id",  sessio_controller.update_get);
router.post("/update/:id",  sessio_controller.update_post);

//API

router.get('/APIlist', validateToken.protegirRuta, sessio_controller.SessioList);

router.get('/APIcreate', validateToken.protegirRuta, sessio_controller.SessioCreateGet);
router.post('/APIcreate', validateToken.protegirRuta, sessio_controller.SessioCreate);

router.delete('/APIdelete/:id', validateToken.protegirRuta, sessio_controller.SessioDelete);

router.put('/APIupdate/:id', validateToken.protegirRuta, sessio_controller.SessioUpdate);



module.exports = router;