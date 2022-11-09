var express = require("express");
var router = express.Router();

const usuaris_controller = require("../controllers/usuarisController");

router.get("/", usuaris_controller.list);

router.get("/create", usuaris_controller.create_get);
router.post("/create", usuaris_controller.create_post);

router.get("/update/:id", usuaris_controller.update_get);
router.post("/update/:id", usuaris_controller.update_post);

router.get("/delete/:id", usuaris_controller.delete_get);
router.post("/delete/:id", usuaris_controller.delete_post);

module.exports = router;