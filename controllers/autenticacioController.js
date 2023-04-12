const Usuari = require("../models/usuari");
const Token = require("../models/token")
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const self = this;
const jwt = require('jsonwebtoken');


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

  //API

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
          res.status(400).json({ message: "error" });
        }
        if (!usuari) {
          var message = "Usuari no registrat";
          res.status(400).json({ message: message });
        } else {
          if (bcrypt.compareSync(password, usuari.password)) {

            let id = usuari.id;

            const token = await self.comprobacioToken(id);

            var usuariData = {
              usuariId: usuari.id,
              nom: usuari.nom,
              email: usuari.email,
              carrec: usuari.carrec,
              dni: usuari.dni,
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

    const user = new Usuari({
      nom: nom,
      cognoms: cognoms,
      dni: dni,
      email: email,
      carrec: "Alumne",
      password: Password,
      profilePicture: 'URL/Profile/profilePicture.png'
    });

    try {
      await user.save();
      return res.status(200).json({ message: "Usuari registrat correctament", user });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Error al registrar l'usuari" });
    }
  };

  async comprobacioToken(id){
    const ahora = new Date();

    let token = await Token.findOne({ idUsuario: id }).populate('usuario').exec();
  
    if (token == null) {
      token = new Token({
        token: uuidv4(),
        usuario: id,
        expira: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // expira en 7 días
      });
  
      await token.save();
    } else if (token.expira < ahora) {
      const newToken = {
        token: uuidv4(),
        expira: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // expira en 7 días
      };
  
      token = await Token.updateOne({_id: token._id}, newToken);
    }
  
    return token;
  }

}

module.exports = autenticacioController;
