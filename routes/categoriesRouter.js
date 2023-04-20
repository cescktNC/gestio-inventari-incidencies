var express = require("express");
var router = express.Router();

var categoria_controller = require('../controllers/categoriaController');

router.get('/', categoria_controller.list); 

router.get('/create', categoria_controller.create_get); 
router.post('/create', categoria_controller.create_post); 

router.get("/delete/:id", categoria_controller.delete_get);
router.post("/delete/:id", categoria_controller.delete_post);

router.get("/update/:id", categoria_controller.update_get);
router.post("/update/:id", categoria_controller.update_post);

//Rutes API

router.get('/APIlist', categoria_controller.categoryList);

router.get('/APIAlllist', categoria_controller.categoryAllList);

router.get('/APIshow/:id', categoria_controller.categorySowh);

router.post('/APIcreate', categoria_controller.categoryCreate);

router.delete('/APIdelete/:id', categoria_controller.categoryDelete);

router.put('/APIupdate/:id', categoria_controller.categoryUpdate);

module.exports = router;