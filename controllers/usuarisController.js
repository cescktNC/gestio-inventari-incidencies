const bcrypt = require('bcrypt');
const Usuari = require("../models/usuari");

class UsuariController {

    static async list(req,res,next) {
        try {
            var list_usuaris = await Usuari.find();
            res.render('usuaris/list', { usuaris:list_usuaris });
        }
        catch(e) {
            res.send('Error!');
        }
    }

    static create_get(req, res, next) {
        var list_carrecs = Usuari.schema.path('carrec').enumValues;
        res.render('usuaris/new', { carrecs:list_carrecs });
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
                        res.render('/usuaris/new',{ error:error.message });
                    } else {             
                        res.redirect('/usuaris');
                    }
                });
            } else {
                var list_carrecs = Usuari.schema.path('carrec').enumValues;
                res.render('usuaris/new', { carrecs:list_carrecs, error: "Usuari ja registrat" });
            }
        });
    }

    static update_get(req, res, next) {
        Usuari.findById(req.params.id, function (err, usuari) {
            if (err) {
                return next(err);
            }
            if (usuari == null) {
              // No results.
              var err = new Error("Usuari not found");
              err.status = 404;
              return next(err);
            }
            // Success.
            var list_carrecs = Usuari.schema.path('carrec').enumValues;
            res.render("usuaris/update", { usuari: usuari, carrecs: list_carrecs });
        });
    }

    static async update_post(req, res, next) {
        // Encriptacio de password
        let password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);

        var usuari = new Usuari({
            _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
            nom: req.body.nom,
            cognoms: req.body.cognoms,
            dni: req.body.dni,
            carrec: req.body.carrec,
            email: req.body.email,
            password: req.body.password,
        });
      
        Usuari.findByIdAndUpdate(
            req.params.id,
            usuari,
            {runValidators: true}, // comportament per defecte: buscar i modificar si el troba sense validar l'Schema
            function (err, usuariFound) {
                let list_carrecs = Usuari.schema.path('carrec').enumValues;
                if (err) {
                    res.render("usuaris/update", { usuari: usuari, error: err.message, carrecs: list_carrecs });
                }          
                res.render("usuaris/update", { usuari: usuari, message: 'User Updated', carrecs: list_carrecs});
            }
        );
    }

    static async delete_get(req, res, next) {
        res.render('usuaris/delete', { id: req.params.id });
    }

    static async delete_post(req, res, next) {
        Usuari.findByIdAndRemove(req.params.id, function (error) {
            if(error){
                res.redirect('/usuaris');
            }else{
                res.redirect('/usuaris');
            }
        });
    }

}

module.exports = UsuariController;