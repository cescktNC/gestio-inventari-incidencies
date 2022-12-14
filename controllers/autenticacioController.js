const Usuari = require("../models/usuari");
const bcrypt = require('bcrypt');
const { body, validationResult } = require("express-validator");


class autenticacioController {

  static loginRegles = [
    // Validar els camps de login.
    body("email")
      .trim()
      .notEmpty()
      .withMessage('El camp Email no pot estar buit.'),
    body("password")
      .trim()
      .notEmpty()
      .withMessage('El camp Password no pot estar buit.'),    
  ];

  static registerRegles = [
    body('nom')
        .notEmpty()
        .withMessage('Nom és obligatori'),
    body('email', 'email is required')
        .notEmpty()
        .withMessage('Email és obligatori')
        .isEmail()
        .withMessage('Format d\'Email no vàlid')
        .custom(async function(value, {req}) {         
            const usuari = await Usuari.findOne({email:value});
            if (usuari) {            
                throw new Error('Aquest Email ja està en us');                 
            }
            return true;
        }).withMessage('Aquest Email ja està en us'),
    body('password')
        .isLength({ min: 1 })
        .withMessage( 'Password és obligatori')
        .custom((val, { req, loc, path }) => {
            if (val !== req.body.confirm_password) {
                throw new Error("Els dos Passwords han de ser iguals");
            } else {
                return true;
            }
        }),
  ];

  static login_get(req, res, next) {
       res.render('autenticacions/login');      
  }

  static login_post(req, res, next) {

    // Recuperem els errors possibles de validació
    const errors = validationResult(req);
      
    // Si tenim errors en les dades enviades
    if (!errors.isEmpty()) {
          var message = 'Email i password són obligatoris.';
          res.render('autenticacions/login',{message:message});
    } else {
      var email = req.body.email;
      var password = req.body.password;
    
      Usuari.findOne({ email: email })        
        .exec(function (err, usuari) {
            if (err) {
              res.send('error');
            }
            if (!usuari) {
              var message = 'Usuari no registrat';
              res.render('autenticacions/login',{message:message});
             } else {
                if (bcrypt.compareSync(password, usuari.password)) {
                  
                  var usuariData = {
                        'usuariId': usuari.id,                  
                        'mom': usuari.nom,
                        'email': usuari.email,
                        'carrec': usuari.carrec,
                   }

                  req.session.data = usuariData
                  res.redirect('/home');
               }
               else {
                  var message = 'Password incorrecte';
                  res.render('autenticacions/login',{message:message});
              }
            }      
                
        }); 

    }
    
  }

  static register_get(req, res, next) {
    
    var usuari = {
      "nom" : "",
      "email": ""
    }
    res.render('autenticacions/register',{usuari:usuari});
      
  }

  static async register_post(req, res, next) {
      
    // Recuperem els errors possibles de validació
    const errors = validationResult(req);
      
    // Si tenim errors en les dades enviades
    if (!errors.isEmpty()) {
        var usuari = {
            "nom" : req.body.nom,
            "email" : req.body.email,
        }
        res.render('autenticacions/register',{errors:errors.array(),usuari:usuari});
    } else {
        const hashpwd = await bcrypt.hash(req.body.password,12);
        var usuari = new Usuari({       
          nom: req.body.nom,
          cognoms: req.body.cognoms,
          dni: req.body.dni,
          role: ["professor"],
          email: req.body.email,
          password: hashpwd
        });
        
        Usuari.create(usuari, (error, newUser) => {
          if(error){
              res.render('autenticacions/register',{'error':'error'});
          }else{
              res.redirect('/autenticacions/login')
          }
        });
    }
  }

  static logout_get(req, res, next) {
    req.session.destroy(function () {
    res.clearCookie("usuari");
    res.redirect("/");
    });     
  }

}

module.exports = autenticacioController;