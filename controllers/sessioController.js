var Sessio = require('../models/sessio');
var Reserva = require("../models/reserva");

class sessioController {

  static async list(req, res, next) {
    Sessio.find()
      .populate('codiReserva')
      .sort({ codi: 1, codiReserva: 1 })
      .exec(function (err, list) {
        if (err) {
          return next(err);
        }
        res.render('sessio/list', { list: list })
      });
  }

  static async create_get(req, res, next) {

    const reserva_list = await Reserva.find();
    res.render('sessio/new', { reservaList: reserva_list, })
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