const Usuari = require("../models/usuari");
const Token = require("../models/token")
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const secret = 'secretDelToken';

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
      .custom(async function (value, { req }) {
        const usuari = await Usuari.findOne({ email: value });
        if (usuari) {
          throw new Error('Aquest Email ja està en us');
        }
        return true;
      }).withMessage('Aquest Email ja està en us'),
    body('password')
      .isLength({ min: 1 })
      .withMessage('Password és obligatori')
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
      var message = "Email i password són obligatoris.";
      res.render("autenticacions/login", { message: message });
    } else {
      var email = req.body.email;
      var password = req.body.password;

      Usuari.findOne({ email: email }).exec(function (err, usuari) {
        if (err) {
          res.send("error");
        }
        if (!usuari) {
          var message = "Usuari no registrat";
          res.render("autenticacions/login", { message: message });
        } else {
          if (bcrypt.compareSync(password, usuari.password)) {
            var usuariData = {
              usuariId: usuari.id,
              nom: usuari.nom,
              email: usuari.email,
              carrec: usuari.carrec,
              dni: usuari.dni,
            };

            req.session.data = usuariData;
            res.redirect("/home");
          } else {
            var message = "Password incorrecte";
            res.render("autenticacions/login", { message: message });
          }
        }
      });
    }
  }

  static register_get(req, res, next) {
    var usuari = {
      nom: "",
      email: "",
    };
    res.render("autenticacions/register", { usuari: usuari });
  }

  static async register_post(req, res, next) {
    // Recuperem els errors possibles de validació
    const errors = validationResult(req);

    // Si tenim errors en les dades enviades
    if (!errors.isEmpty()) {
      var usuari = {
        nom: req.body.nom,
        email: req.body.email,
      };
      res.render("autenticacions/register", {
        errors: errors.array(),
        usuari: usuari,
      });
    } else {
      const hashpwd = await bcrypt.hash(req.body.password, 12);
      var usuari = new Usuari({
        nom: req.body.nom,
        cognoms: req.body.cognoms,
        dni: req.body.dni,
        role: ["professor"],
        email: req.body.email,
        password: hashpwd,
        profilePicture: 'URL/Profile/profilePicture.png'
      });

      Usuari.create(usuari, (error, newUser) => {
        if (error) {
          res.render("autenticacions/register", { error: "error" });
        } else {
          res.redirect("/autenticacions/login");
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

  /**********************************************
   ********************  API  ******************* 
   **********************************************/

  static async login(req, res, next) {
    // Recuperem els errors possibles de validació
    const errors = validationResult(req);

    // Si tenim errors en les dades enviades
    if (!errors.isEmpty()) {
      // var message = "Email i password són obligatoris.";
      res.status(400).json({ errors: errors.array() });
    } else {
      var email = req.body.email;
      var password = req.body.password;

      Usuari.findOne({ email: email }).exec( async function (err, usuari) {
        if (err) {
          res.status(400).json({ errors: err });
        }
        if (!usuari) {
          var message = "Usuari no registrat";
          res.status(400).json({ message: message });
        } else {
          if (bcrypt.hash(password, usuari.password)) {

            const token = await autenticacioController.comprobacioToken(usuari.id, usuari.carrec);

            if(token == null) return res.status(400).json({ message: "Error al inicia sessio" });

            var usuariData = {
              id: usuari.id,
              carrec: usuari.carrec,
              token: token
            };

            res.status(200).json(usuariData)

          } else {
            var message = "Password incorrecte";
            res.status(400).json({ message: message });
          }
        }
      });
    }
  };

  static async register(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nom, cognoms, dni, email, password, confirm_password } = req.body;

    // Validar nombre y apellidos
    if (!nom || !cognoms) {
      return res.status(400).json({ message: "El nom y els cognom son obligatoris" });
    }

    const existingUser = await Usuari.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "El correo electrónic ya está registrat" });
    }

    // Ajustar el factor de costo de hash según las necesidades de seguridad y rendimiento
    const Password = await bcrypt.hash(password, 12);

    const user = ({
      nom: nom,
      cognoms: cognoms,
      dni: dni,
      email: email,
      carrec: "Alumne",
      password: Password,
      profilePicture: 'URL/Profile/profilePicture.png'
    });

    Usuari.create(user, async (error, newUser) => {
      if (error) return res.status(400).json({ message: "Error al registrar l'usuari" }); 
      else {

        let token = await autenticacioController.creacioToken(newUser.id, newUser.carrec)

        if(token == null) res.status(400).json({ message: "Error al verificar el token" });

        return res.status(200).json({ message: "Usuari registrat correctament", user: newUser, token });
      }
    });
  };

  static async creacioToken(id, carrec){
    let token = {
      token: jwt.sign({id: id, carrec: carrec},secret, {expiresIn: "7d"}),
      idUsuari: id
    }

    await Token.create(token,(error, newToken) => {
      if (error) return null;
      else token =  newToken.token;
    });
    return token.token;
  }

  static async comprobacioToken(id, carrec){
    let newToken;

    const token = await Token.findOne({ idUsuari: id }).exec();
    if (token == null) newToken = await autenticacioController.creacioToken(id, carrec);
    else {
      try {
        const decodedToken = jwt.verify(token.token, secret, { ignoreExpiration: false });
        newToken = token.token;
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          await Token.findByIdAndRemove(token.id).exec();
          newToken = await autenticacioController.creacioToken(id, carrec);
        } else {
          return res.status(400).json({ message: "Error al comprobar el token"});
        }
      }
    }
  
    if (!newToken) {
      return res.status(400).json({ message: "Error al crea un nou token" });
    }

    return newToken;

  }

}

module.exports = autenticacioController;
