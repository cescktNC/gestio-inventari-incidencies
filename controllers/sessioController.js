var Sessio = require('../models/sessio');
var Reserva = require("../models/reserva");

class sessioController {

  static async list(req, res, next) {
    try {
      const PAGE_SIZE = 10; // Número de documentos por página
      const page = req.query.page || 1; // Número de página actual
      
      Sessio.countDocuments({}, function(err, count) {
        if (err) {
            return next(err);
        }

        const totalItems = count;
        const totalPages = Math.ceil(totalItems / PAGE_SIZE);
        const startIndex = (page - 1) * PAGE_SIZE;
    
        Sessio.find()
        .sort({ codi: 1, codiReserva: 1 })
        .populate('codiReserva')
        .skip(startIndex)
        .limit(PAGE_SIZE)
        .exec(function (err, list) {
            if (err) {
                return next(err);
            }
            res.render('sessio/list', { list: list, totalPages: totalPages, currentPage: page });
        });
      });
    }
    catch (e) {
        res.send('Error!');
    }
  }

  static async create_get(req, res, next) {

    const reserva_list = await Reserva.find()
    .populate('codiLocalitzacio') // Es captura l'objecte localització per a poder accedir als seus camps des de la vista
    .sort({ codi: 1 }); // '1' - Ordena de petit a gran i '-1' ordena de gran a petit
    res.render('sessio/new', { reservaList: reserva_list })
  }

  static async create_post(req, res) {

    const reserva_list = await Reserva.find();
    Sessio.create(req.body, function (error, newSessio) {
      if (error) {
        res.render('sessio/new', { error: error.message, reservaList: reserva_list })
      } else {
        res.redirect('/sessio')
      }
    })
  }

  static update_get(req, res, next) {
    Sessio.findById(req.params.id, function (err, sessio_list) {
      if (err) {
        return next(err);
      }
      if (sessio_list == null) {
        // No results.
        var err = new Error("sessio no trobada");
        err.status = 404;
        return next(err);
      }
      // Success.
      res.render("sessio/update", { Sessio: sessio_list });
    });

  }
  static update_post(req, res, next) {
    var sessio = {
      codi: req.body.codi,
      nom: req.body.nom,
      // codiReserva: req.params.codiReserva,
      _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
    };

    Sessio.findByIdAndUpdate(
      req.params.id,
      sessio,
      { runValidators: true }, // Per a que faci les comprovacions de les restriccions posades al model
      function (err, sessiofound) {
        if (err) {
          //return next(err);
          res.render("sessio/update", { Sessio: Sessio, error: err.message });
        }
        //res.redirect('/genres/update/'+ genreFound._id);
        res.render("sessio/update", { Sessio: Sessio, message: 'Sessio actualitzada' });
      }
    );
  }
  static async delete_get(req, res, next) {

    res.render('sessio/delete', { id: req.params.id })

  }

  static async delete_post(req, res, next) {

    Sessio.findByIdAndRemove(req.params.id, (error) => {
      if (error) {
        res.redirect('/sessio')
      } else {
        res.redirect('/sessio')
      }
    })
  }
  static async SessioList(req, res, next) {
    try {

      const PAGE_SIZE = 10; // Número de documentos por página
      const page = req.query.page || 1; // Número de página actual

      Sessio.countDocuments({}, function (err, count) {
        if (err) {
          res.status(400).json({ error: err });
        }

        const totalItems = count;
        const totalPages = Math.ceil(totalItems / PAGE_SIZE);
        const startIndex = (page - 1) * PAGE_SIZE;

        Sessio.find()
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

  static async SessioCreate(req, res) {
    let SessioNew = req.body.SessioData
      ;

    // Valida que el código no esté ya registrado
   Sessio.findOne({ codi: SessioNew.codi }, function (err, sessio) {
      if (err) res.status(400).json({ error: err });

      if (sessio == null) {
        // Guardar categoria en la base de datos
        Sessio.create(SessioNew, function (error, newsessio) {
          if (error) res.status(400).json({ error: error.message });

          else res.status(200).json({ ok: true });
        });
      } else res.status(400).json({ error: "Sessio ja registrada" });
    });
  }
  static async SessioUpdate(req, res) {
    const SessioId = req.params.id;
    const updatedSessioData = req.body.SessioData;


    // Valida que el código no esté ya registrado en otra categoría
    Sessio.findOne({ codi: updatedSessioData.codi, _id: { $ne: SessioId } }, function (err, sessio) {
      if (err) res.status(400).json({ error: err });

      if (sessio == null) {
        // Actualizar la categoría en la base de datos
        Sessio.findByIdAndUpdate(SessioId, updatedSessioData, { new: true }, function (error, updatedsessio) {
          if (error) res.status(400).json({ error: error.message });

          else res.status(200).json({ ok: true });
        });
      } else res.status(400).json({ error: "Codi de la sessio ja registrada en un altre sessio" });
    });
  }

  static async SessioDelete(req, res) {
    const SessioId = req.params.id;

    Sessio.findByIdAndRemove(SessioId, function (err, deletedcsessio) {
      if (err) res.status(400).json({ error: err.message });

      else res.status(200).json({ ok: true });
    });
  }
}

module.exports = sessioController;