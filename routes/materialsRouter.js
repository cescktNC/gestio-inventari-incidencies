var express = require("express");
var router = express.Router();
var upload = require('../libs/storage');

var material_controller = require('../controllers/materialsController');

router.get('/', material_controller.list); 

router.get('/create', material_controller.create_get); 
router.post('/create', upload.single('fotografia'), material_controller.create_post); 

router.get("/delete/:id", material_controller.delete_get);
router.post("/delete/:id", material_controller.delete_post);

router.get("/update/:id", material_controller.update_get);
router.post("/update/:id", upload.single('fotografia'), material_controller.update_post);

router.get("/import", material_controller.import_get);
router.post("/import", upload.single('fitxer'), material_controller.import_post);

//API
router.get('/material', material_controller.materiaLlist); 
<<<<<<< HEAD
router.get('/material/allList', material_controller.materiaLlist); 
router.get('/material/:id', material_controller.materialSowh); 
router.post('/material', upload.single('fotografia'), material_controller.materialCreate);
router.post('/material/import', upload.single('fitxer'), material_controller.materialImport);
router.put('/material/:id', upload.single('fotografia'), material_controller.materialUpdate); 
router.delete('/material/:id',material_controller.materialDelete); 
=======
router.get('/material/:id', material_controller.materialSowh); 
router.post('/material', upload.single('fotografia'),material_controller.materialCreate);
router.post('/material/import', upload.single('fitxer'), material_controller.materialCreate);
router.put('/material/:id', material_controller.materialUpdate); 
router.delete('/material/:id', upload.single('fotografia'),material_controller.materialDelete); 
>>>>>>> 7934a22 (Solucio conflictes)



module.exports = router;