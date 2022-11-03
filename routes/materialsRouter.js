var express = require("express");
var router = express.Router();

var material_controller = require('../controllers/materialsController');

router.get('/', material_controller.list); 

router.get('/create', material_controller.create_get); 
router.post('/create', material_controller.create_post); 

/*router.get("/delete/:id", material_controller.delete_get);
router.post("/delete/:id", material_controller.delete_post);

router.get("/update/:id", material_controller.update_get);
router.post("/update/:id", material_controller.update_post);*/


module.exports = router;