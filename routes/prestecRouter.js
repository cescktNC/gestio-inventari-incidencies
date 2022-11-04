var express = require("express");
var router = express.Router();

const prestec_controller = require("../controllers/prestecController");



router.get("/", prestec_controller.list);

router.get("/create", prestec_controller.create_get);
router.post("/create", prestec_controller.create_post);

router.get("/delete/:id", prestec_controller.delete_get);
router.post("/delete/:id", prestec_controller.delete_post);
    
router.get("/update/:id", prestec_controller.update_get);
router.post("/update/:id", prestec_controller.update_post);




module.exports=router;