const Prestec = require("../models/prestec");
const Exemplar = require("../models/exemplar");
const Usuari = require("../models/usuari");

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
  };

  static async prestecCount(req, res, next){
    try {
      const prestecsPendents = await Prestec.find({ estat: 'Pendent' }).exec();
      res.status(200).json({prestecsPendents: prestecsPendents.length});
    } catch (error) {
      res.status(400).json({error: error.message});
    }
  };

  static async prestecShow(req, res, next){
    try {
      Prestec.findById(req.params.id).exec(function(error, prestec){
        if (err) {
          res.status(400).json({ message: err });
        }
        if (prestec == null) {
          // No results.
          var err = new Error("Prestec not found");
          res.status(400).json({ message: err });
        }

        res.status(200).json({ prestec: prestec });
      })
    } catch (error) {
      res.status(400).json(error);
    }
  }

  static async prestecUpdate(req, res, next){
    const dataActual = new Date();

    var prestec = {
      dataRetorn: req.body.prestec.dataRetorn,
      estat: req.body.prestec.estat,
      _id: req.params.id  // Necessari per a que sobreescrigui el mateix objecte!
    };

    if (new Date(prestec.dataRetorn) < dataActual) {
      return res.status(400).json({ error: "La data de retorn no pot ser anterior a la data actual" });
    }

    if(prestec.estat === 'Acceptat'){

      Exemplar.aggregate([
        {
          $match: { demarca: false } // filtra per les condicions pasades
        },
        {
          $lookup: {  // Obtenir informacio de les taules relacionades
            from: 'localitzacios',
            localField: 'codiLocalitzacio',
            foreignField: '_id',
            as: 'localitzacio'
          }
        },
        {
          $lookup: {
            from: 'materials',
            localField: 'codiMaterial',
            foreignField: '_id',
            as: 'material'
          }
        },  
        {
          $match: {
            $and: [
              { 'localitzacio.nom': 'Magatzem-3' },
              { 'material.nom': 'Portatil DELL' }
            ]
          }
        },
        {
          $project: {
            _id: 1
          }
        }
      ], function(err, exemplars) {
        if (err) {
          return res.status(400).json({ error: err });
          return;
        }

        const materialExemplarsIds = exemplars.map(exemplar => exemplar._id.toString());

        const date = new Date();
        const year = date.getFullYear();
        
        const fechaInicial = new Date(( year - 1 ) + '-09-01');
        const fechaFinal = new Date(year + '-06-01');
        
        Prestec.aggregate([
          { $match: { dataRetorn: { $gte: fechaInicial, $lte: fechaFinal } } }, // $gte (mayor o igual que) y $lte (menor o igual que)
          { $sort: { codiExemplar: 1, dataRetorn: -1 } },
          { $group: { _id: "$codiExemplar", lastPrestec: { $first: "$$ROOT" } } }
          // La variable $$ROOT és una variable interna de l'agregació de MongoDB que representa el document complet actual al pipeline d'agregació,
          // incloent tots els camps i valors.
        ], function(err, results) {
          if (err) {
            res.status(400).json({error: 'No hi ha cap element per presta'});
            return;
          }
          const materialPrestecIds = results.map(result => result._id.toString());

          var materialId = [...materialExemplarsIds, ...materialPrestecIds];

          materialId = materialId.filter((element, index) => {
            return materialId.indexOf(element) !== index;
          });

          if(materialId.length == 0) res.status(400).json({error: 'No hi ha cap element per presta'});

          prestec.codiExemplar = materialId[0];

          Prestec.findByIdAndUpdate(
            req.params.id,
            prestec,
            { runValidators: true }, // Per a que faci les comprovacions de les restriccions posades al model
            function (err, prestecfound) {
              if (err) {
                //return next(err);
                res.status(400).json({ error: err.message });
              }
              //res.redirect('/genres/update/'+ genreFound._id);
              res.status(200).json({ ok: true, message: 'Prestec actualitzat' });
            }
          );

        });

      });
    }
  }

  static async estats(req, res, next){
    var list_estats = Prestec.schema.path('estat').enumValues;
    res.status(200).json({ estats: list_estats });
  } 

  static async prestecUpdateStat(req, res, next){
    let estat = req.body.estat;

  };

    

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


module.exports = prestecController;