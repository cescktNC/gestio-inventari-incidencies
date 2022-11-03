var Exemplar = require("../models/exemplar");
var Localitzacio = require("../models/localitzacio");
var Material = require("../models/material");

class ExemplarController {

  static async list(req, res, next) {
    try {
      var list_exemplar = await Exemplar.find();
      res.render('exemplar/list', { list: list_exemplar })
    }
    catch (e) {
      res.send('Error!');
    }
  }

  static async create_get(req, res, next) {

    const localitzacio_list = await Localitzacio.find();
    const material_list = await Material.find();
    res.render('exemplar/new', { localitzacioList: localitzacio_list, materialList: material_list })

  }
  
  static async create_post(req, res) {
    // console.log(req.body)
    // req.body serà algo similar a  { name: 'Aventura' }
    const localitzacio_list = await Localitzacio.find();
    const material_list = await Material.find();
    Exemplar.create(req.body, function (error, newExemplar) {
      if (error) {
        res.render('exemplar/new', { error: error.message, localitzacioList: localitzacio_list, materialList: material_list })
      } else {
        res.redirect('/exemplar')
      }
    })
  }

  static update_get(req, res, next) {
    Exemplar.findById(req.params.id, function (err, exemplar_list) {
      if (err) {
        return next(err);
      }
      if (exemplar_list == null) {
        // No results.
        var err = new Error("Exemplar not found");
        err.status = 404;
        return next(err);
      }
      // Success.
      res.render("exemplar/update", { Exemplar: exemplar_list });
    });

  }
  static update_post(req, res, next) {
    var Exemplar = {
      codi: req.body.codi,
      demarca: req.body.demarca,
      qr: req.body.qr,
      codiLocalitzacio: req.params.codiLocalitzacio,
      _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
    };

    Exemplar.findByIdAndUpdate(
      req.params.id,
      Exemplar,
      { runValidators: true }, // Per a que faci les comprovacions de les restriccions posades al model
      function (err, exemplarfound) {
        if (err) {
          //return next(err);
          res.render("exemplar/update", { Exemplar: Exemplar, error: err.message });
        }
        //res.redirect('/genres/update/'+ genreFound._id);
        res.render("exemplar/update", { Exemplar: Exemplar, message: 'Exemplar Updated' });
      }
    );
  }
  static async delete_get(req, res, next) {

    res.render('exemplar/delete', { id: req.params.id })

  }

  static async delete_post(req, res, next) {

    Exemplar.findByIdAndRemove(req.params.id, (error) => {
      if (error) {
        res.redirect('/exemplar')
      } else {
        res.redirect('/exemplar')
      }
    })
  }

}

module.exports = ExemplarController;
