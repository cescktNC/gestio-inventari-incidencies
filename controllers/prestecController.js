var Prestec = require("../models/prestec");
var Exemplar = require("../models/exemplar");
var Usuari = require("../models/usuari");



class prestecController {

  static async list(req, res, next) {
    try {
      const PAGE_SIZE = 10; // Número de documentos por página
      const page = req.query.page || 1; // Número de página actual
      
      Prestec.countDocuments({}, function(err, count) {
        if (err) {
            return next(err);
        }

        const totalItems = count;
        const totalPages = Math.ceil(totalItems / PAGE_SIZE);
        const startIndex = (page - 1) * PAGE_SIZE;
    
        Prestec.find()
        .sort({ codi: 1, codiExemplar: 1, dataInici: 1 })
        .populate('codiExemplar')
        .populate('dniUsuari')
        .skip(startIndex)
        .limit(PAGE_SIZE)
        .exec(function (err, list) {
            if (err) {
                return next(err);
            }
            res.render('prestec/list', { list: list, totalPages: totalPages, currentPage: page });
        });
      });
    }
    catch (e) {
        res.send('Error!');
    }
  }


  static async create_get(req, res, next) {

    const exemplar_list = await Exemplar.find();
    const usuari_list = await Usuari.find();
    res.render('prestec/new', { exemplarList: exemplar_list, usuariList: usuari_list, introduit: false})

  }

  static async create_post(req, res) {
    
    let codi = await Prestec.count();
    const exemplar_list = await Exemplar.find();
    const usuari_list = await Usuari.find();
    
    let prestec = {
      codi: codi + 1,
      dataInici: req.body.dataInici,
      dataRetorn: req.body.dataRetorn,
      codiExemplar: req.body.codiExemplar,
      dniUsuari: req.body.dniUsuari
    }

    const codiExemplarUsat = await Prestec.findOne({codiExemplar: prestec.codiExemplar});
    if (codiExemplarUsat) {
      return res.render('prestec/new', {
        error: "L'exemplar ja está utilitzat en un altre préstec",
        exemplarList: exemplar_list,
        usuariList: usuari_list,
        introduit: true,
        prestecIntroduit: prestec
      });
    }
    
    Prestec.create(prestec, function (error, newPrestec) {
      if (error) {
        res.render('prestec/new', { error: error.message, exemplarList: exemplar_list, usuariList: usuari_list, introduit: true, prestecIntroduit: prestec })
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

    const dataActual = new Date();

    var prestec = {
      //codi: req.body.codi,
      //dataInici: req.body.dataInici,
      dataRetorn: req.body.dataRetorn,
      _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
    };

    if (new Date(prestec.dataRetorn) < dataActual) {
      return res.render("prestec/update", { Prestec: Prestec, error: "La data de retorn no pot ser anterior a la data actual" });
    }

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

  static async prestecList(req, res, next) {
    try {
      const PAGE_SIZE = 10; // Número de documentos por página
      const page = req.query.page || 1; // Número de página actual
      
      Prestec.countDocuments({}, function(err, count) {
        if (err) {
            res.status(400).json({errors: err});
        }

        const totalItems = count;
        const totalPages = Math.ceil(totalItems / PAGE_SIZE);
        const startIndex = (page - 1) * PAGE_SIZE;
    
        Prestec.find()
        .sort({ codi: 1, codiExemplar: 1, dataInici: 1 })
        .populate('codiExemplar')
        .populate('dniUsuari')
        .skip(startIndex)
        .limit(PAGE_SIZE)
        .exec(function (err, list) {
            if (err) {
              res.status(400).json({error: err});
            }
            res.status(200).json({ list: list, totalPages: totalPages, currentPage: page });
        });
      });
    }
    catch (e) {
      res.status(400).json({error: 'Error!'});
    }
  }

  static async prestecCreate(req, res, next){
    let codi = await Prestec.count() + 1;
    if(codi < 10) codi = '0' + codi;

    Usuari.findOne({dni: req.body.prestec.dni}).exec( function(err, usuari){
      if(err) res.status(400).json({error: err});
      if(usuari == null) res.status(400).json({error: 'Usuari no Trobat'});
      let prestec = {
        codi: codi,
        dataInici: req.body.prestec.dataInici,
        dataRetorn: req.body.prestec.dataRetorn,
        dniUsuari: usuari._id
      }

      Prestec.create(prestec, function (error, newPrestec) {
        if (error) {
          res.status(400).json({ error: error.message })
        } else {
          res.status(400).json({ok: true});
        }
      })
    })
    

    // const codiExemplarUsat = await Prestec.findOne({codiExemplar: prestec.codiExemplar});
    // if (codiExemplarUsat) {
    //   return res.render('prestec/new', {
    //     error: "L'exemplar ja está utilitzat en un altre préstec",
    //     exemplarList: exemplar_list,
    //     usuariList: usuari_list,
    //     introduit: true,
    //     prestecIntroduit: prestec
    //   });
    // }
    
  }
}

module.exports = prestecController;