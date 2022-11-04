const bcrypt = require('bcrypt');
const usuari = require('../models/usuari');
var Usuari = require("../models/usuari");

class UsuariController {

    static async list(req,res,next) {
        try {
            var list_usuaris = await Usuari.find();
            res.render('usuaris/list', {usuaris:list_usuaris});
        }
        catch(e) {
            res.send('Error!');
        }
    }

    static create_get(req, res, next) {
        var list_carrecs = Usuari.schema.path('carrec').enumValues;
        res.render('usuaris/new', {carrecs:list_carrecs});
    }

    static async create_post(req, res) {
        // Encriptacio de password
        let password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);

        // Valida que l'email no estigui ja registrat
        Usuari.findOne({ email: req.body.email }, function (err, usuari) {
            if (err) {
                return next(err);
            }
            if (usuari == null) {
                // Guardar usuari a la base de dades
                Usuari.create(req.body, function (error, newUsuari) {
                    if(error) {
                        res.render('/usuaris/new',{error:error.message});
                    } else {             
                        res.redirect('/usuaris');
                    }
                });
            } else {
                var list_carrecs = Usuari.schema.path('carrec').enumValues;
                res.render('usuaris/new', {carrecs:list_carrecs, error: "Usuari ja registrat"});
            }
        });
    }

}

module.exports = UsuariController;