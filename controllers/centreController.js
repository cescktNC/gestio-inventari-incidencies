var Centre = require("../models/centre");

class CentreController {

  static async list(req, res, next) {
    try {
      const PAGE_SIZE = 10; // Número de documentos por página
      const page = req.query.page || 1; // Número de página actual
      
      Centre.countDocuments({}, function(err, count) {
        if (err) {
            return next(err);
        }

        const totalItems = count;
        const totalPages = Math.ceil(totalItems / PAGE_SIZE);
        const startIndex = (page - 1) * PAGE_SIZE;
    
        Centre.find()
        .sort({ codi: 1 })
        .skip(startIndex)
        .limit(PAGE_SIZE)
        .exec(function (err, list) {
            if (err) {
                return next(err);
            }
            res.render('centre/list', { list: list, totalPages: totalPages, currentPage: page });
        });
      });
    }
    catch (e) {
      res.send('Error!');
    }
  }

  static async create_get(req, res, next) {
    res.render('centre/new')
  }

  static create_post(req, res, next) {

    Centre.create(req.body, (error, newRecord) => {
      if (error) {
        res.render('centre/new', { error: 'error' })
      } else {

        res.redirect('/centre')
      }
    })
  }

  static update_get(req, res, next) {
    Centre.findById(req.params.id, function (err, list_centre) {
      if (err) {
        return next(err);
      }
      if (list_centre == null) {
        // No results.
        var err = new Error("Aquest centre no existeix");
        err.status = 404;
        return next(err);
      }
      // Success.
      res.render("centre/update", { list: list_centre });
    });

  }

  static update_post(req, res, next) {
    var list_centre = new Centre({
      codi: req.body.codi,
      nom: req.body.nom,
      _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
    });

    Centre.findByIdAndUpdate(
      req.params.id,
      list_centre,
      { runValidators: true }, // comportament per defecte: buscar i modificar si el troba sense validar l'Schema
      function (err, list_centreFound) {
        if (err) {

          res.render("centre/update", { list: list_centre, error: err.message });

        }

        res.render("centre/update", { list: list_centre, message: 'Centre actualitzat' });
      }
    );
  }

  static async delete_get(req, res, next) {

    res.render('centre/delete', { id: req.params.id })

  }

  static async delete_post(req, res, next) {

    Centre.findByIdAndRemove(req.params.id, (error) => {
      if (error) {
        res.redirect('/centre')
      } else {
        res.redirect('/centre')
      }
    })
  }
    //API

    static async CentreList(req, res, next) {
      try {
  
        const PAGE_SIZE = 10; // Número de documentos por página
        const page = req.query.page || 1; // Número de página actual
  
        Centre.countDocuments({}, function (err, count) {
          if (err) {
            res.status(400).json({ error: err });
          }
  
          const totalItems = count;
          const totalPages = Math.ceil(totalItems / PAGE_SIZE);
          const startIndex = (page - 1) * PAGE_SIZE;
  
          Centre.find()
            .sort({ nom: 1 })
            .skip(startIndex)
            .limit(PAGE_SIZE)
            .exec(function (err, list) {
              if (err) {
                res.status(400).json({ error: err });
              }
              res.status(200).json({ list: list, totalPages: totalPages, currentPage: page });
            });
        });
      }
      catch (e) {
        res.status(400).json({ message: 'Error!' });
      }
    }
  
    static async CentreCreate(req, res) {
      let CentreNew = req.body.CentreData
        ;
  
      // Valida que el código no esté ya registrado
      Centre.findOne({ codi: CentreNew.codi }, function (err, centre) {
        if (err) res.status(400).json({ error: err });
  
        if (centre == null) {
          // Guardar categoria en la base de datos
          Centre.create(CentreNew, function (error, newcentre) {
            if (error) res.status(400).json({ error: error.message });
  
            else res.status(200).json({ ok: true });
          });
        } else res.status(400).json({ error: "Centre ja registrat" });
      });
    }
    static async CentreUpdate(req, res) {
      const CentreId = req.params.id;
      const updatedCentreData = req.body.CentreData;
  
  
      // Valida que el código no esté ya registrado en otra categoría
      Centre.findOne({ codi: updatedCentreData.codi, _id: { $ne: CentreId } }, function (err, centre) {
        if (err) res.status(400).json({ error: err });
  
        if (centre == null) {
          // Actualizar la categoría en la base de datos
          Centre.findByIdAndUpdate(CentreId, updatedCentreData, { new: true }, function (error, updatedcentre) {
            if (error) res.status(400).json({ error: error.message });
  
            else res.status(200).json({ ok: true });
          });
        } else res.status(400).json({ error: "Codi del centre ja registrat en un altre centre" });
      });
    }
  
    static async CentreDelete(req, res) {
      const centreId = req.params.id;
  
      Centre.findByIdAndRemove(centreId, function (err, deletedcentre) {
        if (err) res.status(400).json({ error: err.message });
  
        else res.status(200).json({ ok: true });
      });
    }
  
  }


module.exports = CentreController;