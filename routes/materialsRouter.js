var express = require("express");
var router = express.Router();
var upload = require('../libs/storage');

var material_controller = require('../controllers/materialController');

router.get('/', material_controller.list); 

router.get('/create', material_controller.create_get); 
router.post('/create', upload.single('fotografia'), material_controller.create_post); 

router.get("/delete/:id", material_controller.delete_get);
router.post("/delete/:id", material_controller.delete_post);

router.get("/update/:id", material_controller.update_get);
router.post("/update/:id", upload.single('fotografia'), material_controller.update_post);

router.get("/import", material_controller.import_get);
router.post("/import", upload.single('fitxer'), material_controller.import_post);


module.exports = router;