var express = require("express");
var router = express.Router();

const exemplar_controller = require("../controllers/exemplarController");



router.get("/", exemplar_controller.list);

router.get("/create", exemplar_controller.create_get);
router.post("/create", exemplar_controller.create_post);
router.get("/delete/:id",  exemplar_controller.delete_get);
router.post("/delete/:id",  exemplar_controller.delete_post);
router.get("/update/:id",  exemplar_controller.update_get);
router.post("/update/:id",  exemplar_controller.update_post);


module.exports = router;