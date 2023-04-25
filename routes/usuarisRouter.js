var express = require("express");
var router = express.Router();
var upload = require('../libs/storage');
const validateToken = require("../middlewares/validateToken");

const usuaris_controller = require("../controllers/usuarisController");

router.get("/", usuaris_controller.list);

router.get("/create", usuaris_controller.create_get);
router.post("/create", upload.single("profilePicture"), usuaris_controller.create_post);

router.get("/update/:id", usuaris_controller.update_get);
router.post("/update/:id", upload.single("profilePicture"), usuaris_controller.update_post);

router.get("/delete/:id", usuaris_controller.delete_get);
router.post("/delete/:id", usuaris_controller.delete_post);

//API
router.get("/user/:id", validateToken.protegirRuta, usuaris_controller.userSowh);
router.get("/user", usuaris_controller.userList);
router.get("/carrecs", usuaris_controller.carrecs);
router.post("/user", upload.single("profilePicture"), usuaris_controller.userCreate);
router.put("/user/:id", upload.single("profilePicture"), usuaris_controller.userUpdate);
router.put("/user/password/:id", usuaris_controller.passwordUpdate);
router.delete("/user/:id", usuaris_controller.userDelete);


module.exports = router;
