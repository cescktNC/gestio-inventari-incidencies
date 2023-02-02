var Prestec = require("../models/prestec");
var Exemplar = require("../models/exemplar");
var Usuari = require("../models/usuari");



class prestecController {

  static async list(req, res, next) {
    Prestec.find()
      .populate('codiExemplar').populate('dniUsuari')
      .sort({ codi: 1, codiExemplar: 1, dataInici: 1 })
      .exec(function (err, list) {
        if (err) {
          return next(err);
        }
        res.render('prestec/list', { list: list })
      });
  }


  static async create_get(req, res, next) {

    const exemplar_list = await Exemplar.find();
    const usuari_list = await Usuari.find();
    res.render('prestec/new', { exemplarList: exemplar_list, usuariList: usuari_list })

  }

  static async create_post(req, res) {

    let codi = await Prestec.count();
    const exemplar_list = await Exemplar.find();
    const usuari_list = await Usuari.find();

    let prestec = {
      codi: codi,
      dataInici: req.body.dataInici,
      dataRetorn: req.body.dataRetorn,
      codiExemplar: req.body.codiExemplar,
      dniUsuari: req.body.dniUsuari
    }

    Prestec.create(prestec, function (error, newPrestec) {
      if (error) {
        res.render('prestec/new', { error: error.message, exemplarList: exemplar_list, usuariList: usuari_list })
      } else {
        res.redirect('/prestec')
      }
    })
  }

  static update_get(req, res, next) {
    Prestec.findById(req.params.id, function (err, prestec_list) {
      if (err) {
        return next(err);
      }
      if (prestec_list == null) {
        // No results.
        var err = new Error("Prestec no trobat");
        err.status = 404;
        return next(err);
      }
      // Success.
      res.render("prestec/update", { Prestec: prestec_list });
    });

  }
  static update_post(req, res, next) {

    var prestec = {
      //codi: req.body.codi,
      //dataInici: req.body.dataInici,
      dataRetorn: req.body.dataRetorn,
      _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
    };

    Prestec.findByIdAndUpdate(
      req.params.id,
      prestec,
      { runValidators: true }, // Per a que faci les comprovacions de les restriccions posades al model
      function (err, prestecfound) {
        if (err) {
          //return next(err);
          res.render("prestec/update", { Prestec: Prestec, error: err.message });
        }
        //res.redirect('/genres/update/'+ genreFound._id);
        res.render("prestec/update", { Prestec: Prestec, message: 'Prestec actualitzat' });
      }
    );
  }

  static async delete_get(req, res, next) {

    res.render('prestec/delete', { id: req.params.id })

  }

  static async delete_post(req, res, next) {

    Prestec.findByIdAndRemove(req.params.id, (error) => {
      if (error) {
        res.redirect('/prestec')
      } else {
        res.redirect('/prestec')
      }
    })
  }
}

module.exports = prestecController;