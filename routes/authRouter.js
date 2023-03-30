var express = require('express');
var router = express.Router();

// Require user controller.
var authController = require('../controllers/autenticacioController');



// GET request for login page.
router.get('/login', authController.login_get);

// POST request for login page.
router.post('/login', authController.loginRegles, authController.login_post);

// GET request for logout page.
router.get('/logout', authController.logout_get);

// GET request for create User.
router.get('/register', authController.register_get);

// POST request for create User.
// router.post('/register', authController.registerRules, authController.register_post);
router.post('/register', authController.registerRegles, authController.register_post);


// Rutes API
router.post('/loginAPI',authController.loginRegles, authController.login);

module.exports = router;