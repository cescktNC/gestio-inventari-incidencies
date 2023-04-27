var express = require("express");
var router = express.Router();
const validateToken = require("../middlewares/validateToken");

const comentari_controller = require("../controllers/comentariController");

router.get("/list/:id", comentari_controller.list);

router.get("/create", comentari_controller.create_get);
router.post("/create", comentari_controller.create_post);

// router.get("/delete/:id",  comentari_controller.delete_get);
// router.post("/delete/:id",  comentari_controller.delete_post);

// router.get("/update/:id",  comentari_controller.update_get);
// router.post("/update/:id",  comentari_controller.update_post);

// API

router.get("/comment/list/:id", validateToken.protegirRuta, comentari_controller.ComentariList);
router.post("/comment/create/:id", validateToken.protegirRuta, comentari_controller.ComentariCreate);

module.exports = router;