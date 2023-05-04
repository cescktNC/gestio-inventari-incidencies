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
  // static async create_post(req, res) {
  //   const localitzacio_list = await Localitzacio.find();
  //   const usuari_list = await Usuari.find();
  //   const reserves_list = await Reserva.find();

  //   let dataReserva = new Date(req.body.data.toString() + 'T' + req.body.hora.split('-')[0].trim());
  //   let dataAvui = new Date();
  //   let diaReserva = dataReserva.getDate();
  //   let diaAvui = dataAvui.getDate();
  //   let horaReserva = (req.body.hora).substring(0, 2);
  //   if (diaReserva >= diaAvui && horaReserva > dataAvui.getHours()) {
  //     var reserva = {
  //       codi: ++reserves_list.pop().codi,
  //       hora: req.body.hora,
  //       data: dataReserva,
  //       dniUsuari: req.body.dniUsuari,
  //       codiLocalitzacio: req.body.codiLocalitzacio,
  //     };
  
  //     Reserva.create(reserva, function (error, newReserva) {
  //       if (error) {
  //         res.render('reserva/new', { error: error.message, localitzacioList: localitzacio_list, dniUsuariList: usuari_list })
  //       } else {
  //         res.redirect('/reserva')
  //       }
  //     });
  //   } else {
  //     let error = new Error("La data no pot ser anterior a la data actual.");
  //     res.render('reserva/new', { error: error.message, localitzacioList: localitzacio_list, dniUsuariList: usuari_list });
  //   }
    
  // }

  static async create_post(req, res) {
    // let utc = -(reserva.horaInici.getTimezoneOffset()) / 60;
    // console.log(reserva.data + 'T' + reserva.horaInici + ':00.000+0' + utc + ':00');
    // console.log(utc.toString());
    const reserves = await Reserva.find();
    reserves.forEach(reserva => {
      console.log(reserva.codi + ' - ' + reserva.horaInici.getHours());
    });
    const localitzacio_list = await Localitzacio.find();
    const usuari_list = await Usuari.find();
    const reserves_list = await Reserva.find();
    
    var dataReserva = new Date(req.body.data.toString() + 'T' + (req.body.horaInici).slice(0,5) + ':00.000Z');
    var diaReserva = dataReserva.getDate();
    var dataAvui = new Date();
    var diaAvui = dataAvui.getDate();
    // let horaInici = parseInt((req.body.horaInici).substring(0, 2));
    // let horaFi = parseInt((req.body.horaFi).substring(0, 2));

    var horaInici = new Date(req.body.data.toString() + 'T' + (req.body.horaInici).slice(0,5) + ':00.000Z');
    var horaFi = new Date(req.body.data.toString() + 'T' + (req.body.horaFi).slice(0,5) + ':00.000Z');
    
    if (horaInici < horaFi) {
      if (diaReserva >= diaAvui) {
        if (horaInici > dataAvui.getHours() || (horaInici == dataAvui.getHours() && minutInici <= dataAvui.getMinutes())) {
          const reserves = await Reserva.find();
          reserves.forEach(reserva => {
            console.log(reserva.horaInici);
            if (!(hora >= horaInicio && hora <= horaFin)) {
              console.log('El horario está fuera del rango establecido');
            } else {
              console.log('El horario está dentro del rango establecido');
            }

            if ((reserva.data).getFullYear() == dataReserva.getFullYear() && (reserva.data).getMonth() == dataReserva.getMonth() && (reserva.data).getDate() == diaReserva) {
              //var reservaHoraInici = new Date(req.body.data.toString() + 'T' + (req.body.horaInici).slice(0,5) + ':00.000Z');
              const [reservaHoraInici, reservaMinutsInici] = (reserva.horaInici).split(':');
              const [reservaHoraFi, reservaMinutsFi] = (reserva.horaFi).split(':');
              if (horaInici >= reservaHoraInici && horaInici <= reservaHoraFi) {
                if (horaInici == reservaHoraInici && minutos < reservaMinutsInici) {

                }
              } else {
                let error = new Error("Horari no disponible");
                res.render('reserva/new', { error: error.message, localitzacioList: localitzacio_list, dniUsuariList: usuari_list });
              }
              
            }
          });
        } else {
          let error = new Error("Les hores seleccionades no poden ser anteriors a l'hora actual.");
          res.render('reserva/new', { error: error.message, localitzacioList: localitzacio_list, dniUsuariList: usuari_list });
        }
      } else {
        let error = new Error("La data seleccionada no pot ser anterior a la data actual.");
        res.render('reserva/new', { error: error.message, localitzacioList: localitzacio_list, dniUsuariList: usuari_list });
      }
    } else {
      let error = new Error("L'hora d'inici ha de ser inferior a l'hora de fi.");
      res.render('reserva/new', { error: error.message, localitzacioList: localitzacio_list, dniUsuariList: usuari_list });
    }
    // if (diaReserva >= diaAvui && horaReserva > dataAvui.getHours()) {
    //   var reserva = {
    //     codi: ++reserves_list.pop().codi,
    //     hora: req.body.hora,
    //     data: dataReserva,
    //     dniUsuari: req.body.dniUsuari,
    //     codiLocalitzacio: req.body.codiLocalitzacio,
    //   };
  
    //   Reserva.create(reserva, function (error, newReserva) {
    //     if (error) {
    //       res.render('reserva/new', { error: error.message, localitzacioList: localitzacio_list, dniUsuariList: usuari_list })
    //     } else {
    //       res.redirect('/reserva')
    //     }
    //   });
    // } else {
    //   let error = new Error("La data no pot ser anterior a la data actual.");
    //   res.render('reserva/new', { error: error.message, localitzacioList: localitzacio_list, dniUsuariList: usuari_list });
    // }
    
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