var express = require("express");
var router = express.Router();
var upload = require('../libs/storage');

const usuaris_controller = require("../controllers/usuarisController");

router.get("/", usuaris_controller.list);

router.get("/create", usuaris_controller.create_get);
router.post("/create", upload.single("profilePicture"), usuaris_controller.create_post);

router.get("/update/:id", usuaris_controller.update_get);
router.post("/update/:id", upload.single("profilePicture"), usuaris_controller.update_post);

router.get("/delete/:id", usuaris_controller.delete_get);
router.post("/delete/:id", usuaris_controller.delete_post);

//API
router.get("/user/:id", usuaris_controller.userSowh);

module.exports = router;
