var express = require("express");
var router = express.Router();
const validateToken = require("../middlewares/validateToken");

const subcategoria_controller = require("../controllers/subcategoriaController");



router.get("/", subcategoria_controller.list);

router.get("/create", subcategoria_controller.create_get);
router.post("/create", subcategoria_controller.create_post);

router.get("/delete/:id",  subcategoria_controller.delete_get);
router.post("/delete/:id",  subcategoria_controller.delete_post);

router.get("/update/:id",  subcategoria_controller.update_get);
router.post("/update/:id",  subcategoria_controller.update_post);

//Rutes API

router.get('/APIlist', validateToken.protegirRuta, subcategoria_controller.SubcategoryList);

router.get('/APIAlllist', validateToken.protegirRuta, subcategoria_controller.SubcategoryAllList);

router.get('/APIshow/:id', validateToken.protegirRuta, subcategoria_controller.subCategorySowh);

router.post('/APIcreate', validateToken.protegirRuta, subcategoria_controller.subCategoryCreate);

router.delete('/APIdelete/:id', validateToken.protegirRuta, subcategoria_controller.subcategoryDelete);

router.put('/APIupdate/:id', validateToken.protegirRuta, subcategoria_controller.subcategoryUpdate);

module.exports = router;