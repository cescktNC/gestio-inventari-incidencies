var Reserva = require("../models/reserva");
var Localitzacio = require("../models/localitzacio");
var Usuari = require("../models/usuari");


class reservaController {
  
  static async list(req, res, next) {

    try {
      const PAGE_SIZE = 10; // Número de documentos por página
      const page = req.query.page || 1; // Número de página actual
      
      Reserva.countDocuments({}, function(err, count) {
        if (err) {
            return next(err);
        }

        const totalItems = count;
        const totalPages = Math.ceil(totalItems / PAGE_SIZE);
        const startIndex = (page - 1) * PAGE_SIZE;
    
        Reserva.find()
        .sort({ codi: 1 })
        .populate('dniUsuari')
        .populate('codiLocalitzacio')
        .skip(startIndex)
        .limit(PAGE_SIZE)
        .exec(function (err, list) {
            if (err) {
                return next(err);
            }
            res.render('reserva/list', { list: list, totalPages: totalPages, currentPage: page });
        });
      });
    }
    catch (e) {
        res.send('Error!');
    }
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

    const localitzacio_list = await Localitzacio.find();
    const usuari_list = await Usuari.find();
    
    var horaInici = new Date(req.body.data.toString() + 'T' + (req.body.horaInici).slice(0,5) + ':00.000Z');
    (horaInici).setTime((horaInici).getTime() + (horaInici).getTimezoneOffset()*60*1000);
    var horaFi = new Date(req.body.data.toString() + 'T' + (req.body.horaFi).slice(0,5) + ':00.000Z');
    (horaFi).setTime((horaFi).getTime() + (horaFi).getTimezoneOffset()*60*1000);
    var avui = new Date();
    
    if (horaInici < horaFi) { // Comprovem que l'hora d'inici no sigui posterior a la de fi
      if (horaInici >= avui) { // Comprovem que l'hora d'inici no sigui posterior a la d'avui
          var reserves = await Reserva.find();
          var horarDisponible = true;
          for (let i = 0; i < reserves.length; i++) {  // Comprovem que no hi hagi ja una reserva feta en aquest horari
            if ( !(horaInici < reserves[i].horaInici && horaFi <= reserves[i].horaInici) || !(horaInici >= reserves[i].horaFi) ) {
              horarDisponible = false;
              break;
            }
          }

          if (!horarDisponible) { // En cas de que ja existeixi una reserva feta
            let horesReservades = [];
            reserves.forEach( reserva => { // Guardem les reserves fetes d'aquest dia per a poder mostrar després des de la vista les hores disponibles
              if (reserva.horaInici.getFullYear() == horaInici.getFullYear() &&
                  reserva.horaInici.getMonth() == horaInici.getMonth() &&
                  reserva.horaInici.getDate() == horaInici.getDate()) {
                    horesReservades.push(reserva);
              }
            });
            let error = new Error("Horari no disponible. Ja hi ha una reserva feta.");
            res.render('reserva/new', { error: error.message, localitzacioList: localitzacio_list, dniUsuariList: usuari_list, horesReservades: horesReservades });
          }
          
          // La reserva es pot crear perquè ha passat totes les validacions
          var reserva = {
            codi: reserves.pop().codi + 1,
            horaInici: horaInici,
            horaFi: horaFi,
            dniUsuari: req.body.dniUsuari,
            codiLocalitzacio: req.body.codiLocalitzacio
          };

          Reserva.create(reserva, function (error, newReserva) {
            if (error) res.render('reserva/new', { error: error.message, localitzacioList: localitzacio_list, dniUsuariList: usuari_list });
            else res.redirect('/reserva');
          });

      } else {
        let error = new Error("La data seleccionada juntament amb les hores escollides no poden ser anteriors a la data i hora actual.");
        res.render('reserva/new', { error: error.message, localitzacioList: localitzacio_list, dniUsuariList: usuari_list });
      }
    } else {
      let error = new Error("L'hora d'inici ha de ser inferior a l'hora de fi.");
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
  static async ReservaList(req, res, next) {
		try {
	
		  const PAGE_SIZE = 10; // Número de documentos por página
		  const page = req.query.page || 1; // Número de página actual
	
		  Reserva.countDocuments({}, function (err, count) {
			if (err) {
			  res.status(400).json({ error: err });
			}
	
			const totalItems = count;
			const totalPages = Math.ceil(totalItems / PAGE_SIZE);
			const startIndex = (page - 1) * PAGE_SIZE;
	
			Reserva.find()
			  .sort({ codi: 1 })
        .populate({
          path: 'dniUsuari',
					select: 'nom'
        })
        .populate({
          path: 'codiLocalitzacio',
					select: 'nom'
        })
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
	
	  static async ReservaCreate(req, res) {
		let Reservanew = req.body.ReservaData
		  ;
	
		// Valida que el código no esté ya registrado
		Reserva.findOne({ codi: Reservanew.codi }, function (err, reserva) {
		  if (err) res.status(400).json({ error: err });
	
		  if (reserva == null) {
			// Guardar categoria en la base de datos
			Reserva.create(Reservanew, function (error, newreservacreate) {
			  if (error) res.status(400).json({ error: error.message });
	
			  else res.status(200).json({ ok: true });
			});
		  } else res.status(400).json({ error: "Reserva ja registrada" });
		});
	  }
	  static async ReservaUpdate(req, res) {
		const ReservaId = req.params.id;
		const updatedReservaData = req.body.ReservaData;
      console.log(req.body)
        
		// Valida que el código no esté ya registrado en otra categoría
		Reserva.findOne({ codi: updatedReservaData.codi, _id: { $ne: ReservaId } }, function (err, reserva) {
		  if (err) res.status(400).json({ error: err });
	
		  if (reserva == null) {
			// Actualizar la categoría en la base de datos
      updatedReservaData.horaInici = new Date(updatedReservaData.horaInici);
      updatedReservaData.horaFi = new Date(updatedReservaData.horaFi);
			Reserva.findByIdAndUpdate(ReservaId, updatedReservaData, { new: true }, function (error, updatedreserva) {
			  if (error) res.status(400).json({ error: error.message });
	
			  else res.status(200).json({ ok: true });
			});
		  } else res.status(400).json({ error: "Codi de la reserva ja registrada en un altre reserva" });
		});
	  }
	
	  static async ReservaDelete(req, res) {
		const ReservaId = req.params.id;
	
		Reserva.findByIdAndRemove(ReservaId, function (err, deletedreserva) {
		  if (err) res.status(400).json({ error: err.message });
	
		  else res.status(200).json({ ok: true });
		});
	  }
}

module.exports = reservaController;