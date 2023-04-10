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
    // console.log(req.body)
    // req.body serà algo similar a  { name: 'Aventura' }
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
}

module.exports = sessioController;