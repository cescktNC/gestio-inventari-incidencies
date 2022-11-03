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


module.exports = router;