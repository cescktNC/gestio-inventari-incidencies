var Exemplar = require("../models/exemplar");
var Localitzacio = require("../models/localitzacio");
var Material = require("../models/material");
var QRCode = require('qrcode');
var url  = require('url');

class ExemplarController {

  static async list(req, res, next) {
    try {
      var list_exemplar = await Exemplar.find()
        .populate('codiMaterial')
        .populate('codiLocalitzacio')
        .sort({ codi: 1, codiMaterial: 1 });
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

    const localitzacio_list = await Localitzacio.find();
    const material_list = await Material.find();
    const material = await Material.findById(req.body.codiMaterial);

    var exemplar = {
      codi: req.body.codi + '/' + material.codi,
      demarca: req.body.demarca,
      codiMaterial: req.body.codiMaterial,
      codiLocalitzacio: req.body.codiLocalitzacio,
    }

    Exemplar.create(exemplar, function (error, newExemplar) {
      if (error) {
        res.render('exemplar/new', { error: error.message, localitzacioList: localitzacio_list, materialList: material_list })
      } else {
        const exemplar_path = url.parse(req.protocol + '://' + req.get('host')).href + 'exemplar/' + newExemplar.id;
        // Genero el QR
        QRCode.toString(exemplar_path, {
          errorCorrectionLevel: 'H',
          type: 'svg'
        }, function(err, qr_svg) {
          if (err) throw err;
          newExemplar['qr'] = qr_svg;
          Exemplar.findByIdAndUpdate(
            newExemplar.id,
            newExemplar,
            { runValidators: true }, // Per a que faci les comprovacions de les restriccions posades al model
            function (err, exemplarfound) {
              if (err) {
                res.render("exemplar/new", { error: error.message, localitzacioList: localitzacio_list, materialList: material_list });
              }
            }
          );
        });
        
        res.redirect('/exemplar');

      }
    });

  }

  static async update_get(req, res, next) {
    const localitzacio_list = await Localitzacio.find();
    const material_list = await Material.find();
    
    Exemplar.findById(req.params.id, function (err, exemplar_list) {
      if (err) {
        return next(err);
      }
      if (exemplar_list == null) {
        // No results.
        var err = new Error("Exemplar no trobat");
        err.status = 404;
        return next(err);
      }
      // Success.
      res.render("exemplar/update", { Exemplar: exemplar_list, localitzacioList: localitzacio_list, materialList: material_list });
    });

  }

  static async update_post(req, res, next) {
    
    const localitzacio_list = await Localitzacio.find();
    const material_list = await Material.find();
    const material = await Material.findById(req.body.codiMaterial);

    req.body.demarca = req.body.demarca == "true";

    
    var exemplar = {
      codi: req.body.codi + '/' + material.codi,
      demarca: req.body.demarca,
      codiMaterial: req.body.codiMaterial,
      codiLocalitzacio: req.body.codiLocalitzacio,
      _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
    };

    Exemplar.findByIdAndUpdate(
      req.params.id,
      exemplar,
      { runValidators: true }, // Per a que faci les comprovacions de les restriccions posades al model
      function (err, exemplarfound) {
        if (err) {
          //return next(err);
          res.render("exemplar/update", { Exemplar: exemplar, localitzacioList: localitzacio_list, materialList: material_list,error: err.message });
        }
        //res.redirect('/genres/update/'+ genreFound._id);
        res.render("exemplar/update", { Exemplar: exemplar, localitzacioList: localitzacio_list, materialList: material_list, message: 'Exemplar actualitzat' });
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

  static async show(req, res, next) {
    try {
      var exemplar = await Exemplar.findById(req.params.id)
        .populate('codiMaterial')
        .populate('codiLocalitzacio')
      res.render('exemplar/show', { exemplar: exemplar });
    } catch (e) {
      res.send('Error!');
    }
  }

}

module.exports = ExemplarController;
