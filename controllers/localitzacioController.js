var Localitzacio = require("../models/localitzacio");
var Planta = require("../models/planta");

class LocalitzacioController {

    static async list(req, res, next) {
        Localitzacio.find()
            .populate('codiPlanta')
            .sort({ codi: 1 })
            .exec(function (err, list) {
                if (err) {
                    return next(err);
                }
                res.render('localitzacio/list', { list: list })
            });
    }

    static async create_get(req, res, next) {

        const planta_list = await Planta.find();
        res.render('localitzacio/new', { plantaList: planta_list, })
    }

    static async create_post(req, res) {

        const planta_list = await Planta.find();
        const planta = await Planta.findById(req.body.codiCentre);
        var localitzacio = {
            codi: req.body.codi + '/' + planta.codi,
            nom: req.body.nom,
            codiCentre: req.body.codiPlanta,
            especial: req.body.especial,
        }
        Localitzacio.create(localitzacio, function (error, newLocalitzacio) {
            if (error) {
                res.render('localitzacio/new', { error: error.message, plantaList: planta_list })
            } else {
                res.redirect('/localitzacio')
            }
        })
    }

    static update_get(req, res, next) {
        Localitzacio.findById(req.params.id, function (err, localitzacio_list) {
            if (err) {
                return next(err);
            }
            if (localitzacio_list == null) {
                // No results.
                var err = new Error("No hem pogut trobar la localització que ens indiques");
                err.status = 404;
                return next(err);
            }
            // Success.
            res.render("localitzacio/update", { Localitzacio: localitzacio_list });
        });

    }
    static update_post(req, res, next) {

        if (req.body.especial === undefined) req.body.especial = false;
        var localitzacio = {
            codi: req.body.codi,
            nom: req.body.nom,
            especial: req.body.especial,
            _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
        };

        console.log(localitzacio)

        Localitzacio.findByIdAndUpdate(
            req.params.id,
            localitzacio,
            { runValidators: true }, // Per a que faci les comprovacions de les restriccions posades al model
            function (err, localitzaciofound) {
                if (err) {
                    //return next(err);
                    res.render("localitzacio/update", { Localitzacio: Localitzacio, error: err.message });
                }
                //res.redirect('/genres/update/'+ genreFound._id);
                res.render("localitzacio/update", { Localitzacio: Localitzacio, message: 'Localitzacio actualitzada' });
            }
        );
    }
    static async delete_get(req, res, next) {

        res.render('localitzacio/delete', { id: req.params.id })

    }

    static async delete_post(req, res, next) {

        Localitzacio.findByIdAndRemove(req.params.id, (error) => {
            if (error) {
                res.redirect('/localitzacio')
            } else {
                res.redirect('/localitzacio')
            }
        })
    }
}

module.exports = LocalitzacioController;