var express = require("express");
var router = express.Router();

const subcategoria_controller = require("../controllers/subcategoriaController");



router.get("/", subcategoria_controller.list);

//router.get("/create", genre_controller.create_get);
//router.post("/create", genre_controller.create_post);

//router.get("/delete/:id", genre_controller.delete_get);
//router.post("/delete/:id", genre_controller.delete_post);

//router.get("/update/:id", genre_controller.update_get);
//router.post("/update/:id", genre_controller.update_post);


module.exports = router;