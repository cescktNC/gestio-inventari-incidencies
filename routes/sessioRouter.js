var express = require("express");
var router = express.Router();

const sessio_controller = require("../controllers/sessioController");



router.get("/", sessio_controller.list);

router.get("/create", sessio_controller.create_get);
router.post("/create", sessio_controller.create_post);

//router.get("/delete/:id",  sessio_controller.delete_get);
//router.post("/delete/:id",  sessio_controller.delete_post);

//router.get("/update/:id",  sessio_controller.update_get);
//router.post("/update/:id",  sessio_controller.update_post);


module.exports = router;