var Exemplar = require("../models/exemplar");
var Localitzacio = require("../models/localitzacio");
var Material = require("../models/material");
var QRCode = require('qrcode');
var url  = require('url');

class ExemplarController {

  static async list(req, res, next) {
    try {
      const PAGE_SIZE = 10; // Número de documentos por página
      const page = req.query.page || 1; // Número de página actual
      Exemplar.countDocuments({}, function(err, count) {
        if (err) {
            return next(err);
        }

        const totalItems = count;
        const totalPages = Math.ceil(totalItems / PAGE_SIZE);
        const startIndex = (page - 1) * PAGE_SIZE;
    
        Exemplar.find()
        .sort({ codi: 1, codiMaterial: 1 })
        .populate('codiMaterial')
        .populate('codiLocalitzacio')
        .skip(startIndex)
        .limit(PAGE_SIZE)
        .exec(function (err, list) {
            if (err) {
                return next(err);
            }
            res.render('exemplar/list', { list: list, totalPages: totalPages, currentPage: page });
        });
      });
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
      if(exemplar_list.demarca){
        var err = new Error('Aquest exemplar no es pot modificar');
        err.status = 400;
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
    const localitzacio = await Localitzacio.findById(req.body.codiLocalitzacio);

    const comprobacioExemplar = await Exemplar.findById(req.params.id);

    if(comprobacioExemplar.demarca){
      var err = new Error('Aquest exemplar no es pot modificar');
      err.status = 400;
      return next(err);
    }

    req.body.demarca = req.body.demarca == "true";
    
    var exemplar = {
      codi: req.body.codi + '/' + material.codi+'-'+localitzacio.codi,
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

<<<<<<< HEAD
  //API

  static async exemplarList(req, res, next) {
    try {
      const PAGE_SIZE = 10; // Número de documents per página
      const page = req.query.page || 1; // Número de página actual
      
      Exemplar.countDocuments({}, function(err, count) {
        if (err) {
            res.status(400).json({ error: err });
        }

        const totalItems = count;
        const totalPages = Math.ceil(totalItems / PAGE_SIZE);
        const startIndex = (page - 1) * PAGE_SIZE;
    
        Exemplar.find()
        .sort({ codi: 1, codiMaterial: 1 })
        .populate('codiMaterial')
        .populate('codiLocalitzacio')
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
      res.status(400).json({ error: 'Error!' });
    }
  }

  static async exemplarSowh(req, res, next){
    Exemplar.findById(req.params.id)
    .populate('codiMaterial')
    .populate('codiLocalitzacio')
    .exec(function(err, exemplar) {
      if (err) {
        res.status(400).json({ error: err });
      }
      if (exemplar == null) {
        // No results.
        var err = new Error("Exemplar not found");
        res.status(400).json({ error: err });

      }
      res.status(200).json({ exemplar: exemplar });

    });
}

  static async exemplarCreate(req, res, next) {
    Material.findById(req.body.exemplar.codiMaterial).exec(function(error, material){
      if(error) res.status(400).json({error});
      if(material == null) res.status(400).json({error: 'Material no trobat'});

      Localitzacio.findById(req.body.exemplar.codiLocalitzacio).exec(function(error, localitzacio){
        if(error) res.status(400).json({error});
        if(localitzacio == null) res.status(400).json({error: 'Localitzacio no trobada'});

        let codi = req.body.exemplar.codi;
        if(parseInt(codi) > 10) codi = '0' + codi;

        var exemplar = {
          codi: codi + '/' + material.codi + '-' + localitzacio.codi,
          demarca: false,
          codiMaterial: req.body.exemplar.codiMaterial,
          codiLocalitzacio: req.body.exemplar.codiLocalitzacio,
        }

        Exemplar.create(exemplar, function (error, newExemplar) {
          if (error) res.status(400).json({ error: error.message })

          const exemplar_path = url.parse('http://localhost:3000').href + 'home/exemplar/show/' + newExemplar.id;
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
              { runValidators: true },
              function (err, exemplarfound) {
                if (err) {
                  res.status(400).json({ error: error.message });
                }
                else res.status(200).json({ok: true})
              }
            );
          });
              
          
        });
      })
    });

  }

  static async exemplarUpdate(req, res, next) {

    Material.findById(req.body.exemplar.codiMaterial).exec(function(error, material){
      if(error) res.status(400).json({error});
      if(material == null) res.status(400).json({error: 'Material no trobat'});

      Localitzacio.findById(req.body.exemplar.codiLocalitzacio).exec(function(error, localitzacio){
        if(error) res.status(400).json({error});
        if(localitzacio == null) res.status(400).json({error: 'Localitzacio no trobada'});

        Exemplar.findById(req.params.id).exec(function(error, comprobacioExemplar){
          if(error) res.status(400).json({error});

          if(comprobacioExemplar == null) res.status(400).json({error: 'Exemplar no trobat'});

          if(comprobacioExemplar.demarca){
            var err = new Error('Aquest exemplar no es pot modificar');
            return res.status(400).json({error: err});
          }

          let codi = req.body.exemplar.codi;
          if(parseInt(codi) > 10) codi = '0' + codi;
          
          var exemplar = {
            codi: codi + '/' + material.codi + '-' + localitzacio.codi,
            demarca: req.body.exemplar.demarca,
            codiMaterial: req.body.exemplar.codiMaterial,
            codiLocalitzacio: req.body.exemplar.codiLocalitzacio,
            _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
          };
      
          Exemplar.findByIdAndUpdate(
            req.params.id,
            exemplar,
            { runValidators: true }, // Per a que faci les comprovacions de les restriccions posades al model
            function (err, exemplarfound) {
              if (err) {
                //return next(err);
                res.status(400).json({ error: err.message });
              }
              res.status(200).json({ ok: true, message: 'Exemplar actualitzat' });
            }
          );

        });

      });

    });
  }

=======
  static async exemplarList(req, res, next) {
    try {
      const PAGE_SIZE = 10; // Número de documentos por página
      const page = req.query.page || 1; // Número de página actual
      
      Exemplar.countDocuments({}, function(err, count) {
          if (err) {
              res.status(400).json({ error: err });
          }
  
          const totalItems = count;
          const totalPages = Math.ceil(totalItems / PAGE_SIZE);
          const startIndex = (page - 1) * PAGE_SIZE;
      
          Exemplar.find()
          .sort({ codi: 1, codiMaterial: 1 })
          .populate('codiMaterial')
          .populate('codiLocalitzacio')
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

>>>>>>> 7934a22 (Solucio conflictes)
}

module.exports = ExemplarController;
