const bcrypt = require('bcrypt');
const Usuari = require("../models/usuari");

class UsuariController {

    static async list(req,res,next) {
        try {
            var list_usuaris = await Usuari.find().sort({nom: 1, cognoms: 1});
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

        // Flag per a comprovar que els passwords introduits siguin iguals
        let correctPassword = true;
        // Es recuperen el llistat de càrrecs
        let list_carrecs = Usuari.schema.path('carrec').enumValues;

        // Es crea l'usuari amb les dades del formulari
        var usuari = new Usuari({
            _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
            nom: req.body.nom,
            cognoms: req.body.cognoms,
            dni: req.body.dni,
            carrec: req.body.carrec,
            email: req.body.email,
        });

        // Validar DNI
        if (usuari.checkLetterDNI(req.body.dni)) {

            // Validar si es vol canviar el password
            if (req.body.password1.length != 0 && req.body.password2.length != 0) {
                // Validar si els passwords introduits són iguals
                if (req.body.password1 == req.body.password2) {
                    // Encriptacio de password
                    let password = req.body.password1;
                    const salt = await bcrypt.genSalt(10);
                    usuari.password = await bcrypt.hash(password, salt);
                } else {
                    correctPassword = false;
                    res.render("usuaris/update", { usuari: usuari, message: 'Les dues contrasenyes han de ser iguals.', carrecs: list_carrecs});
                }
            }

            if (correctPassword) {
                // Actualitzar les dades de l'usuari
                Usuari.findByIdAndUpdate(
                    req.params.id,
                    usuari,
                    {runValidators: true}, // comportament per defecte: buscar i modificar si el troba sense validar l'Schema
                    function (err, usuariFound) {
                        if (err) {
                            res.render("usuaris/update", { usuari: usuari, error: err.message, carrecs: list_carrecs });
                        }          
                        res.render("usuaris/update", { usuari: usuari, message: 'Usuari actualitzat correctament', carrecs: list_carrecs});
                    }
                );
            }
        } else res.render("usuaris/update", { usuari: usuari, message: 'DNI no vàlid.', carrecs: list_carrecs});

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