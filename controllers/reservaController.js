var Reserva = require("../models/reserva");
var Localitzacio = require("../models/localitzacio");
var Usuari = require("../models/usuari");


class reservaController{
    static async list(req,res,next) {
      Reserva.find()
      .populate('dniUsuari') .populate('codiLocalitzacio')
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
        // console.log(req.body)
        // req.body serà algo similar a  { name: 'Aventura' }
        const localitzacio_list = await Localitzacio.find();
        const usuari_list = await Usuari.find();
        Reserva.create(req.body, function (error, newReserva) {
          if (error) {
            res.render('reserva/new', { error: error.message, localitzacioList: localitzacio_list, dniUsuariList: usuari_list })
          } else {
            res.redirect('/reserva')
          }
        })
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

module.exports=reservaController;