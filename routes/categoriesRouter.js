var express = require("express");
var router = express.Router();

var categoria_controller = require('../controllers/categoriaController');

router.get('/', categoria_controller.list);


module.exports = router;