var Localitzacio = require("../models/localitzacio");
var Planta = require("../models/planta");

class LocalitzacioController {

  static async list(req, res, next) {
    try {
      const PAGE_SIZE = 10; // Número de documentos por página
      const page = req.query.page || 1; // Número de página actual

      Localitzacio.countDocuments({}, function(err, count) {
        if (err) {
          return next(err);
        }

        const totalItems = count;
        const totalPages = Math.ceil(totalItems / PAGE_SIZE);
        const startIndex = (page - 1) * PAGE_SIZE;
    
        Localitzacio.find()
        .sort({ codiPlanta: 1, codi: 1 })
        .populate('codiPlanta')
        .skip(startIndex)
        .limit(PAGE_SIZE)
        .exec(function (err, list) {
          if (err) {
            return next(err);
          }
          res.render('localitzacio/list', { list: list, totalPages: totalPages, currentPage: page });
        });
      });
    }
    catch (e) {
      res.send('Error!');
    }
  }

  static async create_get(req, res, next) {
    const planta_list = await Planta.find();
    res.render('localitzacio/new', { plantaList: planta_list, })
  }

  static async create_post(req, res) {

    const planta_list = await Planta.find();
    const planta = await Planta.findById(req.body.codiPlanta);
    var localitzacio = {
      codi: req.body.codi + '/' + planta.codi,
      nom: req.body.nom,
      codiPlanta: req.body.codiPlanta,
      especial: req.body.especial,
    }
    Localitzacio.create(localitzacio, function (error, newLocalitzacio) {
      if (error) {
        res.render('localitzacio/new', { error: error.message, plantaList: planta_list })
      } else {
        res.redirect('/localitzacio')
      }
    })
  }

  static async update_get(req, res, next) {
    const planta_list = await Planta.find();
    Localitzacio.findById(req.params.id, function (err, localitzacio_list) {
      if (err) {
        return next(err);
      }
      if (localitzacio_list == null) {
        // No results.
        var err = new Error("No hem pogut trobar la localització que ens indiques");
        err.status = 404;
        return next(err);
      }
      // Success.
      res.render("localitzacio/update", { Localitzacio: localitzacio_list, plantaList: planta_list });
    });

  }
  
  static async update_post(req, res, next) {

    const planta_list = await Planta.find();
    const planta = await Planta.findById(req.body.codiPlanta);

    if (req.body.especial === undefined) req.body.especial = false;
    var localitzacio = {
      codi: req.body.codi + '/' + planta.codi,
      nom: req.body.nom,
      codiPlanta: req.body.codiPlanta,
      especial: req.body.especial,
      _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
    };

    Localitzacio.findByIdAndUpdate(
      req.params.id,
      localitzacio,
      { runValidators: true }, // Per a que faci les comprovacions de les restriccions posades al model
      function (err, localitzaciofound) {
        if (err) {
          //return next(err);
          res.render("localitzacio/update", { Localitzacio: localitzacio, plantaList: planta_list, error: err.message });
        }
        //res.redirect('/genres/update/'+ genreFound._id);
        res.render("localitzacio/update", { Localitzacio: localitzacio, plantaList: planta_list, message: 'Localitzacio actualitzada' });
      }
    );
  }

  static async delete_get(req, res, next) {
    res.render('localitzacio/delete', { id: req.params.id })
  }

  static async delete_post(req, res, next) {
    Localitzacio.findByIdAndRemove(req.params.id, (error) => {
      if (error) {
        res.redirect('/localitzacio');
      } else {
        res.redirect('/localitzacio');
      }
    })
  }
  
  static async localitzacioList(req, res, next) {
    try {

      const PAGE_SIZE = 10; // Número de documentos por página
      const page = req.query.page || 1; // Número de página actual

        Localitzacio.countDocuments({}, function (err, count) {
        if (err) {
          res.status(400).json({ error: err });
        }

        const totalItems = count;
        const totalPages = Math.ceil(totalItems / PAGE_SIZE);
        const startIndex = (page - 1) * PAGE_SIZE;
    
        Localitzacio.find()
          .sort({ codiPlanta: 1, codi: 1 })
          .populate({path: 'codiPlanta', select: 'nom'})
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


  //API 

  static async localitzacioAllLlist(req, res, next) {
    try {
      Localitzacio.find()
      .sort({ codiPlanta: 1, codi: 1 })
      .populate('codiPlanta')
      .exec(function (err, list) {
        if (err) {
          res.status(400).json({ error: err });
        }
        res.status(200).json({ list: list });
      });

    }
    catch (e) {
      res.status(400).json({ message: e });
    }
  }
	
	static async localitzacioCreate(req, res) {
		try {
      let localitzacioNew = req.body.LocalitzacioData;

      let comprobacioNom = await Localitzacio.find({codiPlanta: localitzacioNew.codiPlanta, nom: localitzacioNew.nom }).exec();
      if(comprobacioNom !== undefined) res.status(400).json({error: 'Ya existeix una localització amb aquest nom'});
      else{
        let planta = await Planta.findById(localitzacioNew.codiPlanta);
        localitzacioNew.codi = await Localitzacio.find({codiPlanta: localitzacioNew.codiPlanta}).count() + 1;

        if(localitzacioNew.codi < 10) localitzacioNew.codi = '0' + localitzacioNew.codi;
        localitzacioNew.codi = localitzacioNew.codi + '/' + planta.codi;

        Localitzacio.create(localitzacioNew, function (error, createlocalitzacio) {
          if (error) res.status(400).json({ errors: error });

          else res.status(200).json({ ok: true });
        });
      }

    } catch (error) {
      res.status(400).json({ message: error});
    }
	}

	static async localitzacioUpdate(req, res) {
		const localitzacioId = req.params.id;
		let updatedLocalitzacioData = req.body.LocalitzacioData;

    if(updatedLocalitzacioData.newCodiPlanta !== updatedLocalitzacioData.codiPlanta._id){
      let planta = await Planta.findById(updatedLocalitzacioData.codiPlanta).exec();
      updatedLocalitzacioData.codi = await Localitzacio.find({codiPlanta: updatedLocalitzacioData.newCodiPlanta}).count() + 1;

      if(updatedLocalitzacioData.codi < 10) updatedLocalitzacioData.codi = '0' + updatedLocalitzacioData.codi;

      updatedLocalitzacioData.codi = updatedLocalitzacioData.codi + '/' + planta.codi;
      updatedLocalitzacioData.codiPlanta = updatedLocalitzacioData.newCodiPlanta;
    }

    Localitzacio.findByIdAndUpdate(localitzacioId, updatedLocalitzacioData, { new: true }, function (error, updatedlocalitzacio) {
      if (error) res.status(400).json({ error: error.message });

      else res.status(200).json({ ok: true });
    });

	}
	
	static async LocalitzacioDelete(req, res) {
		const LocalitzacioId = req.params.id;
	
		Localitzacio.findByIdAndRemove(LocalitzacioId, function (err, deletedplanta) {
      if (err) res.status(400).json({ error: err.message });
  
      else res.status(200).json({ ok: true });
		});
	}


  static async localitzacioAllLlist(req, res, next) {
    try {
    
    Localitzacio.find()
    .sort({ codiPlanta: 1, codi: 1 })
    .populate('codiPlanta')
    .exec(function (err, list) {
      if (err) {
        res.status(400).json({ error: err });
      }
      res.status(200).json({ list: list });
    });

    }
    catch (e) {
      res.status(400).json({ message: 'Error!' });
    }
  }

  static async localitzacioSowh(req, res, next){
    Localitzacio.findById(req.params.id)
    .populate({
      path: 'codiPlanta',
      select: 'nom'
    })
    .exec(function(err, localitzacio) {

      if (err) {
        res.status(400).json({ error: err });
      }

      if (localitzacio == null) {
        // No results.
        res.status(400).json({ error: "Localitzacio not found" });

      }
      res.status(200).json({ localitzacio });

    });
  }
}

module.exports = LocalitzacioController;