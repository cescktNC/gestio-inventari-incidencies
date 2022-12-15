var Reserva = require("../models/reserva");
var Localitzacio = require("../models/localitzacio");
var Usuari = require("../models/usuari");


class reservaController {
  static async list(req, res, next) {
    Reserva.find()
      .populate('dniUsuari').populate('codiLocalitzacio')
      .sort({ codi: 1 })
      .exec(function (err, list) {
        if (err) {
          return next(err);
        }
        res.render('reserva/list', { list: list })
      });
  }

  static async create_get(req, res, next) {

    const localitzacio_list = await Localitzacio.find();
    const usuari_list = await Usuari.find();
    res.render('reserva/new', { localitzacioList: localitzacio_list, dniUsuariList: usuari_list })

  }
  static async create_post(req, res) {
    const localitzacio_list = await Localitzacio.find();
    const usuari_list = await Usuari.find();
    const reserves_list = await Reserva.find();

    let dataReserva = new Date(req.body.data.toString() + 'T' + req.body.hora.split('-')[0].trim());
    let dataAvui = new Date();
    if (dataReserva >= dataAvui) {
      var reserva = {
        codi: ++reserves_list.pop().codi,
        hora: req.body.hora,
        data: dataReserva,
        dniUsuari: req.body.dniUsuari,
        codiLocalitzacio: req.body.codiLocalitzacio,
      };
  
      Reserva.create(reserva, function (error, newReserva) {
        if (error) {
          res.render('reserva/new', { error: error.message, localitzacioList: localitzacio_list, dniUsuariList: usuari_list })
        } else {
          res.redirect('/reserva')
        }
      });
    } else {
      let error = new Error("La data no pot ser anterior a la data actual.");
      res.render('reserva/new', { error: error.message, localitzacioList: localitzacio_list, dniUsuariList: usuari_list });
    }
    
  }

  static update_get(req, res, next) {
    Reserva.findById(req.params.id, function (err, reserva_list) {
      if (err) {
        return next(err);
      }
      if (reserva_list == null) {
        // No results.
        var err = new Error("La reserva no existeix en el nostre sistema");
        err.status = 404;
        return next(err);
      }
      // Success.
      res.render("reserva/update", { Reserva: reserva_list });
    });

  }
  static update_post(req, res, next) {
    var reserva = {
      codi: req.body.codi,
      hora: req.body.hora,
      data: req.body.data,
      //dniUsuari: req.params.dniUsuari
      //codiLocalitzacio: req.params.codiLocalitzacio,
      _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
    };

    Reserva.findByIdAndUpdate(
      req.params.id,
      reserva,
      { runValidators: true }, // Per a que faci les comprovacions de les restriccions posades al model
      function (err, reservafound) {
        if (err) {
          //return next(err);
          res.render("reserva/update", { Reserva: Reserva, error: err.message });
        }
        //res.redirect('/genres/update/'+ genreFound._id);
        res.render("reserva/update", { Reserva: Reserva, message: 'Reserva actualitzada' });
      }
    );
  }
  static async delete_get(req, res, next) {

    res.render('reserva/delete', { id: req.params.id })

  }

  static async delete_post(req, res, next) {

    Reserva.findByIdAndRemove(req.params.id, (error) => {
      if (error) {
        res.redirect('/reserva')
      } else {
        res.redirect('/reserva')
      }
    })
  }

}

module.exports = reservaController;