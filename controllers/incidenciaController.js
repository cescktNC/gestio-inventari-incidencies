var Incidencia = require("../models/incidencia");
var Exemplar = require('../models/exemplar');
var Localitzacio = require('../models/localitzacio');
var Material = require('../models/material')

class IncidenciaController {

    static async list(req, res, next) {
        try {
            const PAGE_SIZE = 10; // Número de documentos por página
            const page = req.query.page || 1; // Número de página actual
            
            Incidencia.countDocuments({}, async function(err, count) {
                if (err) {
                    return next(err);
                }

                var list_material = await Material.find();
        
                const totalItems = count;
                const totalPages = Math.ceil(totalItems / PAGE_SIZE);
                const startIndex = (page - 1) * PAGE_SIZE;
            
                Incidencia.find()
                .sort({ codi: 1 })
                .populate('codiExemplar')
                .populate('codiLocalitzacio')
                .skip(startIndex)
                .limit(PAGE_SIZE)
                .exec(function (err, list) {
                    if (err) {
                        return next(err);
                    }
                    res.render('incidencies/list', { list: list, totalPages: totalPages, currentPage: page, list_mat: list_material });
                });
            });
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

        var codi = await Incidencia.count();

        Exemplar.find({ codi: req.body.codiExemplar }, function (err, exemplar) {
            if (err) {
                return next(err);
            }
            var incidencia = {
                codi: codi + 1,
                data: Date.now(),
                tipologia: req.body.tipologia,
                proposta: '',
                prioritat: req.body.prioritat,
                descripcio: req.body.descripcio,
                ubicacio: req.body.ubicacio,
                codiLocalitzacio: req.body.codiLocalitzacio,
                codiExemplar: null
            }
            if (exemplar.length != 0) {
                incidencia["codiExemplar"] = exemplar[0].id;
            }
            Incidencia.create(incidencia, function (error, newRecord) {
                if (error) {
                    console.log(error)
                    res.render('incidencies/new', { error: 'error', list_prio: list_prioritat, list_tip: list_tipologia, list_loc: list_localitzacio })
                } else {
    
                    res.redirect('/incidencies')
                }
            })
        });

    };

    static async update_get(req, res, next) {
        var list_prioritat = Incidencia.schema.path('prioritat').enumValues;
        var list_estat = Incidencia.schema.path('estat').enumValues;
        var list_tipologia = Incidencia.schema.path('tipologia').enumValues;
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
                list: list_incidencia, list_pri: list_prioritat, list_tipo: list_tipologia,
                list_loc: list_localitzacio, list_exe: list_exemplar, list_est: list_estat
            });
        });

    }

    static async update_post(req, res, next) {

        var list_prioritat = Incidencia.schema.path('prioritat').enumValues;
        var list_tipologia = Incidencia.schema.path('tipologia').enumValues;
        var list_estat = Incidencia.schema.path('estat').enumValues;
        var list_localitzacio = await Localitzacio.find();
        var list_exemplar = await Exemplar.find();

        Exemplar.find({ codi: req.body.codiExemplar }, function (err, exemplar) {
            if (err) {
                return next(err);
            }
            var list_incidencia = new Incidencia({
                tipologia: req.body.tipologia,
                proposta: req.body.proposta,
                prioritat: req.body.prioritat,
                estat: req.body.estat,
                descripcio: req.body.descripcio,
                ubicacio: req.body.ubicacio,
                seguiment: req.body.seguiment,
                codiExemplar: null,
                codiLocalitzacio: req.body.codiLocalitzacio,
                _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
            });

            if (exemplar.length != 0) list_incidencia["codiExemplar"] = exemplar[0].id;

            Incidencia.findByIdAndUpdate(
                req.params.id,
                list_incidencia,
                { runValidators: true }, // comportament per defecte: buscar i modificar si el troba sense validar l'Schema
                function (err, list_incidenciaFound) {
                    if (err) {
                        res.render("incidencies/update", {
                            list: list_incidencia, list_pri: list_prioritat,
                            list_loc: list_localitzacio, list_exe: list_exemplar, list_est: list_estat, list_tipo: list_tipologia,
                            error: err.message
                        });
                    }
                    res.render("incidencies/update", {
                        list: list_incidencia, list_pri: list_prioritat,
                        list_loc: list_localitzacio, list_exe: list_exemplar, list_est: list_estat,
                        list_tipo: list_tipologia, message: 'Incidencia actualitzada'
                    });
                }
            );

        });
        
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

    //API

    static async incidenciaList(req, res, next) {
        try {
            const PAGE_SIZE = 10; // Número de documentos por página
            const page = req.query.page || 1; // Número de página actual
            
            Incidencia.countDocuments({}, async function(err, count) {
                if (err) {
                    return next(err);
                }
        
                const totalItems = count;
                const totalPages = Math.ceil(totalItems / PAGE_SIZE);
                const startIndex = (page - 1) * PAGE_SIZE;
            
                Incidencia.find()
                .sort({ data: -1, codi: 1 })
                .populate({
                    path: 'codiExemplar',
                    populate: { path: 'codiMaterial', model: 'Material' }
                })
                .populate('codiLocalitzacio')
                .skip(startIndex)
                .limit(PAGE_SIZE)
                .exec(function (err, list) {
                    if (err) {
                        res.status(400).json({error: err});
                    }
                    res.status(200).json({ list: list, totalPages: totalPages, currentPage: page });
                });
            });
        }
        catch (e) {
            res.status(400).json({error: e});
        }
    }

    static async IncidenciaCreate(req, res, next){
        try {
            var codi = await Incidencia.count();
            if(codi < 10) codi = '0' + codi;

            Exemplar.find({ codi: req.body.incidencia.codiExemplar }, function (err, exemplar) {
                if (err) {
                    res.status(400).json({error: err});
                }
                var incidencia = {
                    codi: codi + 1,
                    data: Date.now(),
                    tipologia: req.body.incidencia.tipologia,
                    proposta: '',
                    prioritat: req.body.incidencia.prioritat,
                    descripcio: req.body.incidencia.descripcio,
                    ubicacio: req.body.incidencia.ubicacio,
                    codiLocalitzacio: req.body.incidencia.codiLocalitzacio,
                    codiExemplar: null
                }

                if (exemplar.length != 0) {
                    incidencia["codiExemplar"] = exemplar[0].id;
                }

                Incidencia.create(incidencia, function (error, newRecord) {
                    if (error) {
                        res.status(400).json({ error })
                    } else {
                        res.status(200).json({ok: true})
                    }
                })
            });
        } catch (error) {
            res.status(400).json({error});
        }
    };

    static async incidenciaEnum(req, res, next){
        try {
            var list_prioritat = Incidencia.schema.path('prioritat').enumValues;
            var list_tipologia = Incidencia.schema.path('tipologia').enumValues;
            res.status(200).json({prioritat: list_prioritat, tipologia:list_tipologia});
        } catch (error) {
            res.status(400).json({error});
        }
    }; 

    static async incidenciaShow(req, res, next){
        try {
            let incidencia =  await Incidencia.findById(req.params.id).populate('codiExemplar');
            let incidenciaJSON = {...incidencia, codiExemplar: incidencia.codiExemplar.codi}
            res.status(200).json({incidencia: incidenciaJSON});
        } catch (error) {
            res.status(400).json({error});
        }
    }

    static async incidenciaUpdate(req,res,next){
        try {
            Exemplar.find({ codi: req.body.incidencia.codiExemplar }, function (err, exemplar) {
                if (err) {
                    return next(err);
                }
                var list_incidencia = new Incidencia({
                    tipologia: req.body.incidencia.tipologia,
                    proposta: req.body.incidencia.proposta,
                    prioritat: req.body.incidencia.prioritat,
                    estat: req.body.incidencia.estat,
                    descripcio: req.body.incidencia.descripcio,
                    ubicacio: req.body.incidencia.ubicacio,
                    seguiment: req.body.incidencia.seguiment,
                    codiExemplar: null,
                    codiLocalitzacio: req.body.incidencia.codiLocalitzacio,
                    _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
                });
    
                if (exemplar.length != 0) list_incidencia["codiExemplar"] = exemplar[0].id;
    
                Incidencia.findByIdAndUpdate(
                    req.params.id,
                    list_incidencia,
                    { runValidators: true }, // comportament per defecte: buscar i modificar si el troba sense validar l'Schema
                    function (err, list_incidenciaFound) {
                        if (err) {
                            res.status(400).json({ error: err.message });
                        }
                        res.status(200).json({ok: true});
                    }
                );
    
            });
        } catch (error) {
            res.status(400).json({error});
        }
    }
}

module.exports = IncidenciaController;
