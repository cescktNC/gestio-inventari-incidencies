const bcrypt = require('bcrypt');
var Usuari = require('../models/usuari');

class UsuariController {

    static async list(req, res, next) {
        try {
            const PAGE_SIZE = 10; // Número de documentos por página
            const page = req.query.page || 1; // Número de página actual
            
            Usuari.countDocuments({}, function(err, count) {
                if (err) {
                    return next(err);
                }
        
                const totalItems = count;
                const totalPages = Math.ceil(totalItems / PAGE_SIZE);
                const startIndex = (page - 1) * PAGE_SIZE;
            
                Usuari.find()
                .sort({ nom: 1, cognoms: 1 })

                .skip(startIndex)
                .limit(PAGE_SIZE)
                .exec(function (err, list) {
                    if (err) {
                        return next(err);
                    }
                    res.render('usuaris/list', { usuaris: list, totalPages: totalPages, currentPage: page });
                });
            });
        }
        catch (e) {
            res.send('Error!');
        }
    }

    static create_get(req, res, next) {
        var list_carrecs = Usuari.schema.path('carrec').enumValues;
        res.render('usuaris/new', { carrecs: list_carrecs });
    }

    static async create_post(req, res) {
        // Encriptacio de password
        let password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
        let usuariNew;
        if (req.file == undefined) {
            usuariNew = {
                nom: req.body.nom,
                cognoms: req.body.cognoms,
                dni: req.body.dni,
                carrec: req.body.carrec,
                email: req.body.email,
                password: req.body.password,
                profilePicture: 'URL/Profile/profilePicture.png'
            }
        } else {
            usuariNew = {
                nom: req.body.nom,
                cognoms: req.body.cognoms,
                dni: req.body.dni,
                carrec: req.body.carrec,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.file.path.substring(7, req.file.path.length)
            }
        }

        // Valida que l'email no estigui ja registrat
        Usuari.findOne({ email: req.body.email }, function (err, usuari) {
            if (err) {
                return next(err);
            }
            if (usuari == null) {
                // Guardar usuari a la base de dades
                Usuari.create(usuariNew, function (error, newUsuari) {
                    if (error) {
                        var list_carrecs = Usuari.schema.path('carrec').enumValues;
                        res.render('usuaris/new', { error: error.message, carrecs: list_carrecs });
                    } else {
                        res.redirect('/usuaris');
                    }
                });
            } else {
                var list_carrecs = Usuari.schema.path('carrec').enumValues;
                res.render('usuaris/new', { carrecs: list_carrecs, error: "Usuari ja registrat" });
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
        let usuari
        if (req.file == undefined) {
            usuari = new Usuari({
                _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
                nom: req.body.nom,
                cognoms: req.body.cognoms,
                dni: req.body.dni,
                carrec: req.body.carrec,
                email: req.body.email,
            });
        } else {
            usuari = new Usuari({
                _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
                nom: req.body.nom,
                cognoms: req.body.cognoms,
                dni: req.body.dni,
                carrec: req.body.carrec,
                email: req.body.email,
                profilePicture: req.file.path.substring(7, req.file.path.length)

            });
        }

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
                    res.render("usuaris/update", { usuari: usuari, message: 'Les dues contrasenyes han de ser iguals.', carrecs: list_carrecs });
                }
            }

            if (correctPassword) {
                // Actualitzar les dades de l'usuari
                Usuari.findByIdAndUpdate(
                    req.params.id,
                    usuari,
                    { runValidators: true }, // comportament per defecte: buscar i modificar si el troba sense validar l'Schema
                    function (err, usuariFound) {
                        if (err) {
                            res.render("usuaris/update", { usuari: usuari, error: err.message, carrecs: list_carrecs });
                        }
                        res.render("usuaris/update", { usuari: usuari, message: 'Usuari actualitzat correctament', carrecs: list_carrecs });
                    }
                );
            }
        } else res.render("usuaris/update", { usuari: usuari, message: 'DNI no vàlid.', carrecs: list_carrecs });

    }

    static async delete_get(req, res, next) {
        res.render('usuaris/delete', { id: req.params.id });
    }

    static async delete_post(req, res, next) {
        Usuari.findByIdAndRemove(req.params.id, function (error) {
            if (error) {
                res.redirect('/usuaris');
            } else {
                res.redirect('/usuaris');
            }
        });
    }

    // API

    static async userList(req, res, next) {
        try {
            const PAGE_SIZE = 10; // Número de documentos por página
            const page = req.query.page || 1; // Número de página actual

            const startIndex = (page - 1) * PAGE_SIZE;

            const list_usuaris = await Usuari.find()
            .sort({ nom: 1, cognoms: 1 })
            .skip(startIndex)
            .limit(PAGE_SIZE);

            // var list_usuaris = await Usuari.find().sort({ nom: 1, cognoms: 1 });
            res.status(200).json({ usuaris: list_usuaris });
        }
        catch (e) {
            res.status(400).json({ message: 'Error!' });
        }
    }

    static async userCreate(req, res) {
        // Encriptacio de password
        let password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
        let usuariNew;
        if (req.file == undefined) {
            usuariNew = {
                nom: req.body.nom,
                cognoms: req.body.cognoms,
                dni: req.body.dni,
                carrec: req.body.carrec,
                email: req.body.email,
                password: req.body.password,
                profilePicture: 'URL/Profile/profilePicture.png'
            }
        } else {
            usuariNew = {
                nom: req.body.nom,
                cognoms: req.body.cognoms,
                dni: req.body.dni,
                carrec: req.body.carrec,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.file.path.substring(7, req.file.path.length)
            }
        }

        // Valida que l'email no estigui ja registrat
        Usuari.findOne({ email: req.body.email }, function (err, usuari) {
            if (err) res.status(400).json({ error: err });

            if (usuari == null) {
                // Guardar usuari a la base de dades
                Usuari.create(usuariNew, function (error, newUsuari) {

                    if (error) res.status(400).json({ error: error.message });

                    else res.status(200).json({ ok: true });

                });
            } 
            
            else res.status(400).json({ error: "Usuari ja registrat" });
        });
    }

    static async userSowh(req, res, next){
        Usuari.findById(req.params.id, function(err, usuari) {
            if (err) {
                res.status(400).json({ message: err });
            }
            if (usuari == null) {
                // No results.
                var err = new Error("Usuari not found");
                res.status(400).json({ message: err });

            }
            // Success.
            var usuariJSON={
                nom: usuari.nom,
                cognoms: usuari.cognoms,
                dni: usuari.dni,
                carrec: usuari.carrec,
                email: usuari.email,
                profilePicture: usuari.profilePicture,
            };
            res.status(200).json({ usuari: usuariJSON });

        })
    }

    static async update_post(req, res, next) {

        // Flag per a comprovar que els passwords introduits siguin iguals
        let correctPassword = true;

        // Es crea l'usuari amb les dades del formulari
        let usuari;
        if (req.file == undefined) {
            usuari = new Usuari({
                _id: req.params.id,  
                nom: req.body.nom,
                cognoms: req.body.cognoms,
                dni: req.body.dni,
                carrec: req.body.carrec,
                email: req.body.email,
            });
        } else {
            usuari = new Usuari({
                _id: req.params.id,  
                nom: req.body.nom,
                cognoms: req.body.cognoms,
                dni: req.body.dni,
                carrec: req.body.carrec,
                email: req.body.email,
                profilePicture: req.file.path.substring(7, req.file.path.length)

            });
        }

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
                    res.status(400).json({ usuari: usuari, message: 'Les dues contrasenyes han de ser iguals.' });
                }
            }

            if (correctPassword) {
                // Actualitzar les dades de l'usuari
                Usuari.findByIdAndUpdate(
                    req.params.id,
                    usuari,
                    { runValidators: true }, // comportament per defecte: buscar i modificar si el troba sense validar l'Schema
                    function (err, usuariFound) {

                        if (err) res.status(400).json({ usuari: usuari, error: err.message });

                        res.status(400).json({ usuari: usuari, message: 'Usuari actualitzat correctament' });
                    }
                );
            }
        } else res.status(400).json({ usuari: usuari, message: 'DNI no vàlid.' });
        
    }

    static async userDelete(req, res, next) {
        Usuari.findByIdAndRemove(req.params.id, function (error) {
            if (error) {
                res.status(400).json({ error });
            } else {
                res.status(200).json({ ok: true });

            }
        });
    }

    static async carrecs(req, res, next){
        var list_carrecs = Usuari.schema.path('carrec').enumValues;
        res.status(200).json({ carrecs: list_carrecs });
    }

}

module.exports = UsuariController;