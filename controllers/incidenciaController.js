var Incidencia = require("../models/incidencia");
var Exemplar = require('../models/exemplar');
var Localitzacio = require('../models/localitzacio')

class IncidenciaController {

    static async list(req, res, next) {
        try {
            var list_incidencia = await Incidencia.find().populate('codiExemplar').populate('codiCentre');
            res.render('incidencies/list', { list: list_incidencia })
        }
        catch (e) {
            res.send('Error!');
        }
    }

    static async create_get(req, res, next) {
        var list_localitzacio = await Localitzacio.find();
        var list_prioritat = Incidencia.schema.path('prioritat').enumValues;
        res.render('incidencies/new', { list: list_prioritat, list_loc: list_localitzacio })
    }

    static async create_post(req, res, next) {

        var list_prioritat = Incidencia.schema.path('prioritat').enumValues;
        var list_localitzacio = await Localitzacio.find();

        var codi = Exemplar.findOne({ codi: req.body.codiExemplar });
        console.log(codi.demarca)

        var incidencia = {
            codi: Math.random(),
            data: Date.now(),
            proposta: req.body.proposta,
            prioritat: req.body.prioritat,
            descripcio: req.body.descripcio,
            ubicacio: req.body.ubicacio,
            codiExemplar: req.body.codiExemplar,
            codiCentre: codi.id,
        }

        Incidencia.create(incidencia, (error, newRecord) => {
            if (error) {
                res.render('incidencies/new', { error: error.message, list: list_prioritat, list_loc: list_localitzacio })
            } else {

                res.redirect('/incidencies')
            }
        })
    }

    /*static update_get(req, res, next) {
        Categoria.findById(req.params.id, function (err, list_categoria) {
            if (err) {
                return next(err);
            }
            if (list_categoria == null) {
                // No results.
                var err = new Error("Categoria not found");
                err.status = 404;
                return next(err);
            }
            // Success.
            res.render("categories/update", { list: list_categoria });
        });

    }

    static update_post(req, res, next) {
        var list_categoria = new Categoria({
            nom: req.body.nom,
            codi: req.body.codi,
            _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
          });    
        
          Categoria.findByIdAndUpdate(
            req.params.id,
            list_categoria,
            {runValidators: true}, // comportament per defecte: buscar i modificar si el troba sense validar l'Schema
            function (err, list_categoriaFound) {
              if (err) {
                
                res.render("categories/update", { list: list_categoria, error: err.message });
    
              }          
              
              res.render("categories/update", { list: list_categoria, message: 'Categoria Updated'});
            }
          );
    }

    static async delete_get(req, res, next) {

        res.render('categories/delete', { id: req.params.id })

    }

    static async delete_post(req, res, next) {

        Categoria.findByIdAndRemove(req.params.id, (error) => {
            if (error) {
                res.redirect('/categories')
            } else {
                res.redirect('/categories')
            }
        })
    }*/

}

module.exports = IncidenciaController;
