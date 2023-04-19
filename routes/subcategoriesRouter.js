var express = require("express");
var router = express.Router();

const subcategoria_controller = require("../controllers/subcategoriaController");



router.get("/", subcategoria_controller.list);

router.get("/create", subcategoria_controller.create_get);
router.post("/create", subcategoria_controller.create_post);

router.get("/delete/:id",  subcategoria_controller.delete_get);
router.post("/delete/:id",  subcategoria_controller.delete_post);

router.get("/update/:id",  subcategoria_controller.update_get);
router.post("/update/:id",  subcategoria_controller.update_post);

//Rutes API

router.get('/APIlist', subcategoria_controller.SubcategoryList);

router.post('/APIcreate', subcategoria_controller.subCategoryCreate);

router.get('/APIdelete/:id', subcategoria_controller.subcategoryDelete);
router.delete('/APIdelete/:id', subcategoria_controller.subcategoryDelete);

router.get('/APIupdate/:id', subcategoria_controller.subcategoryUpdate);
router.put('/APIupdate/:id', subcategoria_controller.subcategoryUpdate);

module.exports = router;