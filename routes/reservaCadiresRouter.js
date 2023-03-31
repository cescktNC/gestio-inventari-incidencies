var express = require("express");
var router = express.Router();

var reservaCadira_controller = require('../controllers/reservaCadiraController');

router.get('/:id', reservaCadira_controller.list);

router.get("/create/:id/:cadira", reservaCadira_controller.create);
router.get("/delete/:id", reservaCadira_controller.delete);
// router.post("/create", cadira_controller.create_post);
// router.get("/delete/:id",  cadira_controller.delete_get);
// router.post("/delete/:id",  cadira_controller.delete_post);
// router.get("/update/:id",  cadira_controller.update_get);
// router.post("/update/:id",  cadira_controller.update_post);



module.exports = router;
