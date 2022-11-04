var express = require("express");
var router = express.Router();

const usuaris_controller = require("../controllers/usuarisController");

router.get("/", usuaris_controller.list);

router.get("/create", usuaris_controller.create_get);
router.post("/create", usuaris_controller.create_post);

module.exports = router;