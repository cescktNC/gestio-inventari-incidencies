var Incidencia = require("../models/incidencia");
var Exemplar = require('../models/exemplar');
var Localitzacio = require('../models/localitzacio');
var Material = require('../models/material')

class IncidenciaController {

    static async list(req, res, next) {
        try {
            var list_incidencia = await Incidencia.find()
                .populate('codiExemplar')
                .populate('codiLocalitzacio')
                .sort({ codi: 1 });
            var list_material = await Material.find();
            res.render('incidencies/list', { list: list_incidencia, list_mat: list_material })
        }
        catch (e) {
            res.send('Error!');
        }
    }

    static async create_get(req, res, next) {
        var list_prioritat = Incidencia.schema.path('prioritat').enumValues;
        var list_tipologia = Incidencia.schema.path('tipologia').enumValues;
        var list_localitzacio = await Localitzacio.find();
        res.render('incidencies/new', { list_prio: list_prioritat, list_tip: list_tipologia, list_loc: list_localitzacio })
    }

    static async create_post(req, res, next) {

        var list_prioritat = Incidencia.schema.path('prioritat').enumValues;
        var list_tipologia = Incidencia.schema.path('tipologia').enumValues;
        var list_localitzacio = await Localitzacio.find();
        var exemplar = await Exemplar.find({ codi: req.body.codiExemplar });

        var incidencia = {
            codi: Math.random() * 100,
            data: Date.now(),
            tipologia: req.body.tipologia,
            proposta: req.body.proposta,
            prioritat: req.body.prioritat,
            descripcio: req.body.descripcio,
            ubicacio: req.body.ubicacio,
            codiExemplar: exemplar.id,
            codiLocalitzacio: req.body.codiLocalitzacio,
        }

        Incidencia.create(incidencia, function (error, newRecord) {
            if (error) {
                res.render('incidencies/new', { error: 'error', list_prio: list_prioritat, list_tip: list_tipologia, list_loc: list_localitzacio })
            } else {

                res.redirect('/incidencies')
            }
        })
    };

    static async update_get(req, res, next) {
        var list_prioritat = Incidencia.schema.path('prioritat').enumValues;
        var list_estat = Incidencia.schema.path('estat').enumValues;
        var list_localitzacio = await Localitzacio.find();
        var list_exemplar = await Exemplar.find();

        Incidencia.findById(req.params.id, function (err, list_incidencia) {
            if (err) {
                return next(err);
            }
            if (list_incidencia == null) {
                // No results.
                var err = new Error("Aquesta incidencia no està registrada al sistema");
                err.status = 404;
                return next(err);
            }
            // Success.
            res.render("incidencies/update", {
                list: list_incidencia, list_pri: list_prioritat,
                list_loc: list_localitzacio, list_exe: list_exemplar, list_est: list_estat
            });
        });

    }

    static async update_post(req, res, next) {

        var list_prioritat = Incidencia.schema.path('prioritat').enumValues;
        var list_estat = Incidencia.schema.path('estat').enumValues;
        var list_localitzacio = await Localitzacio.find();
        var list_exemplar = await Exemplar.find();
        var exemplar = await Exemplar.find({ codi: req.body.codiExemplar });

        var list_incidencia = new Incidencia({
            proposta: req.body.proposta,
            prioritat: req.body.prioritat,
            estat: req.body.estat,
            descripcio: req.body.descripcio,
            ubicacio: req.body.ubicacio,
            seguiment: req.body.seguiment,
            codiExemplar: exemplar.id,
            codiLocalitzacio: req.body.codiLocalitzacio,
            _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
        });

        Incidencia.findByIdAndUpdate(
            req.params.id,
            list_incidencia,
            { runValidators: true }, // comportament per defecte: buscar i modificar si el troba sense validar l'Schema
            function (err, list_incidenciaFound) {
                if (err) {

                    res.render("incidencies/update", {
                        list: list_incidencia, list_pri: list_prioritat,
                        list_loc: list_localitzacio, list_exe: list_exemplar, list_est: list_estat, error: err.message
                    });

                }

                res.render("incidencies/update", {
                    list: list_incidencia, list_pri: list_prioritat,
                    list_loc: list_localitzacio, list_exe: list_exemplar, list_est: list_estat, message: 'Incidencia actualitzada'
                });
            }
        );
    }

    static async delete_get(req, res, next) {

        res.render('incidencies/delete', { id: req.params.id })

    }

    static async delete_post(req, res, next) {

        Incidencia.findByIdAndRemove(req.params.id, (error) => {
            if (error) {
                res.redirect('/incidencies')
            } else {
                res.redirect('/incidencies')
            }
        })
    }

}

module.exports = IncidenciaController;
