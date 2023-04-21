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
  
  static async LocalitzacioList(req, res, next) {
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
          .sort({ nom: 1 })
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
            res.status(400).json({ message: 'Error!' });
        }
    }

    static async localitzacioSowh(req, res, next){
        Localitzacio.findById(req.params.id)
        .populate('codiLocalitzacio')
        .exec(function(err, localitzacio) {
            if (err) {
                res.status(400).json({ message: err });
            }
            if (localitzacio == null) {
                // No results.
                var err = new Error("Localitzacio not found");
                res.status(400).json({ message: err });

            }
            // Success.
            var localitzacioJSON = {
                nom: localitzacio.nom,
                codi: localitzacio.codi,
            };
            res.status(200).json({ localitzacio: localitzacioJSON });

        })
    }
    
    static async LocalitzacioList(req, res, next) {
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
                .sort({ nom: 1 })
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
	
	static async LocalitzacioCreate(req, res) {
		let localitzacioNew = req.body.LocalitzacioData;
	
		// Valida que el código no esté ya registrado
		Localitzacio.findOne({ codi: localitzacioNew.codi }, function (err, localitzacio) {
            if (err) res.status(400).json({ error: err });
        
            if (localitzacio == null) {
                // Guardar categoria en la base de datos
                Localitzacio.create(localitzacioNew, function (error, createlocalitzacio) {
                if (error) res.status(400).json({ error: error.message });
        
                else res.status(200).json({ ok: true });
                });
            } else res.status(400).json({ error: "Localitzacio ja registrada" });
		});
	}

	static async LocalitzacioUpdate(req, res) {
		const localitzacioId = req.params.id;
		const updatedLocalitzacioData = req.body.LocalitzacioData;

		// Valida que el código no esté ya registrado en otra categoría
		Localitzacio.findOne({ codi: updatedLocalitzacioData.codi, _id: { $ne: localitzacioId } }, function (err, localitzacio) {
            if (err) res.status(400).json({ error: err });
        
            if (localitzacio == null) {
                // Actualizar la categoría en la base de datos
                Localitzacio.findByIdAndUpdate(localitzacioId, updatedLocalitzacioData, { new: true }, function (error, updatedlocalitzacio) {
                if (error) res.status(400).json({ error: error.message });
        
                else res.status(200).json({ ok: true });
                });
            } else res.status(400).json({ error: "Codi de la localitzacio ja registrada en un altre localitzacio" });
        });
	}
	
	static async LocalitzacioDelete(req, res) {
		const LocalitzacioId = req.params.id;
	
		LocalitzacioData.findByIdAndRemove(LocalitzacioId, function (err, deletedplanta) {
            if (err) res.status(400).json({ error: err.message });
        
            else res.status(200).json({ ok: true });
		});
	}
    static async LocalitzacioCreate(req, res) {
      let localitzacioNew = req.body.LocalitzacioData
        ;
    
      // Valida que el código no esté ya registrado
      Localitzacio.findOne({ codi: localitzacioNew.codi }, function (err, localitzacio) {
        if (err) res.status(400).json({ error: err });
    
        if (localitzacio == null) {
        // Guardar categoria en la base de datos
        Localitzacio.create(localitzacioNew, function (error, createlocalitzacio) {
          if (error) res.status(400).json({ error: error.message });
    
          else res.status(200).json({ ok: true });
        });
        } else res.status(400).json({ error: "Localitzacio ja registrada" });
      });
    }

    static async LocalitzacioUpdate(req, res) {
      const localitzacioId = req.params.id;
      const updatedLocalitzacioData = req.body.LocalitzacioData;
    
    
      // Valida que el código no esté ya registrado en otra categoría
      Localitzacio.findOne({ codi: updatedLocalitzacioData.codi, _id: { $ne: localitzacioId } }, function (err, localitzacio) {
        if (err) res.status(400).json({ error: err });
    
        if (localitzacio == null) {
        // Actualizar la categoría en la base de datos
        Localitzacio.findByIdAndUpdate(localitzacioId, updatedLocalitzacioData, { new: true }, function (error, updatedlocalitzacio) {
          if (error) res.status(400).json({ error: error.message });
    
          else res.status(200).json({ ok: true });
        });
        } else res.status(400).json({ error: "Codi de la localitzacio ja registrada en un altre localitzacio" });
      });
    }

  static async LocalitzacioDelete(req, res) {
    const LocalitzacioId = req.params.id;

    LocalitzacioData.findByIdAndRemove(LocalitzacioId, function (err, deletedplanta) {
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
    .populate('codiLocalitzacio')
    .exec(function(err, localitzacio) {
      if (err) {
        res.status(400).json({ message: err });
      }

      if (localitzacio == null) {
        // No results.
        var err = new Error("Localitzacio not found");
        res.status(400).json({ message: err });

      }

      // Success.
      var localitzacioJSON = {
        nom: localitzacio.nom,
        codi: localitzacio.codi,
      };

      res.status(200).json({ localitzacio: localitzacioJSON });

    })
  }
}

module.exports = LocalitzacioController;