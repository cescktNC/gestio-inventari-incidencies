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


module.exports = router;