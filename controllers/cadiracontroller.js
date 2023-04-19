var Cadira = require("../models/cadira");
var Sessio = require("../models/sessio");

class cadiraController {

  static async list(req, res, next) {
    try {
      const PAGE_SIZE = 10; // Número de documentos por página
      const page = req.query.page || 1; // Número de página actual

      Cadira.countDocuments({}, function(err, count) {
        if (err) {
          return next(err);
        }

        const totalItems = count;
        const totalPages = Math.ceil(totalItems / PAGE_SIZE);
        const startIndex = (page - 1) * PAGE_SIZE;

        Cadira.find()
          .sort({ fila: 1, numero: 1 })
          .skip(startIndex)
          .limit(PAGE_SIZE)
          .exec(function (err, list) {
            if (err) {
              return next(err);
            }
            res.render('cadira/list', { list: list, totalPages: totalPages, currentPage: page })
          });
      });
    }
    catch (e) {
      res.send('Error!');
    }
  }

  static async create_get(req, res, next) {

    const sessio_list = await Sessio.find();
    res.render('cadira/new', { sessioList: sessio_list, })
  }

  static async create_post(req, res) {
    // console.log(req.body)
    // req.body serà algo similar a  { name: 'Aventura' }
    const sessio_list = await Sessio.find();
    Cadira.create(req.body, function (error, newCadira) {
      if (error) {
        res.render('cadira/new', { error: error.message, sessioList: sessio_list })
      } else {
        res.redirect('/cadira')
      }
    })
  }
  static update_get(req, res, next) {
    Cadira.findById(req.params.id, function (err, cadira_list) {
      if (err) {
        return next(err);
      }
      if (cadira_list == null) {
        // No results.
        var err = new Error("Cadira ja assignada");
        err.status = 404;
        return next(err);
      }
      // Success.
      res.render("cadira/update", { Cadira: cadira_list });
    });

  }
  static update_post(req, res, next) {
    var cadira = {
      numeroCadira: req.body.numeroCadira,
      // codiSessio: req.params.codiSessio,
      _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
    };

    Cadira.findByIdAndUpdate(
      req.params.id,
      cadira,
      { runValidators: true }, // Per a que faci les comprovacions de les restriccions posades al model
      function (err, cadirafound) {
        if (err) {
          //return next(err);
          res.render("cadira/update", { Cadira: Cadira, error: err.message });
        }
        //res.redirect('/genres/update/'+ genreFound._id);
        res.render("cadira/update", { Cadira: Cadira, message: 'Cadira actualitzada' });
      }
    );
  }

  static async delete_get(req, res, next) {

    res.render('cadira/delete', { id: req.params.id })

  }

  static async delete_post(req, res, next) {

    Cadira.findByIdAndRemove(req.params.id, (error) => {
      if (error) {
        res.redirect('/cadira')
      } else {
        res.redirect('/cadira')
      }
    })
  }

  static async CadiraList(req, res, next) {
    try {

      const PAGE_SIZE = 10; // Número de documentos por página
      const page = req.query.page || 1; // Número de página actual

      Cadira.countDocuments({}, function (err, count) {
        if (err) {
          res.status(400).json({ error: err });
        }

        const totalItems = count;
        const totalPages = Math.ceil(totalItems / PAGE_SIZE);
        const startIndex = (page - 1) * PAGE_SIZE;

        Cadira.find()
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

  static async CadiraCreate(req, res) {
    let CadiraNew = req.body.CadiraData
      ;

    // Valida que el código no esté ya registrado
    Cadira.findOne({ codi: CadiraNew.codi }, function (err, cadira) {
      if (err) res.status(400).json({ error: err });

      if (cadira == null) {
        // Guardar categoria en la base de datos
        Cadira.create(CadiraNew, function (error, newcadira) {
          if (error) res.status(400).json({ error: error.message });

          else res.status(200).json({ ok: true });
        });
      } else res.status(400).json({ error: "Cadira ja registrada" });
    });
  }
  static async CadiraUpdate(req, res) {
    const CadiraId = req.params.id;
    const updatedCadiraData = req.body.CentreData;


    // Valida que el código no esté ya registrado en otra categoría
    Cadira.findOne({ codi: updatedCadiraData.codi, _id: { $ne: CadiraId } }, function (err, cadira) {
      if (err) res.status(400).json({ error: err });

      if (cadira == null) {
        // Actualizar la categoría en la base de datos
        Cadira.findByIdAndUpdate(CentreId, updatedCadiraData, { new: true }, function (error, updatedcadira) {
          if (error) res.status(400).json({ error: error.message });

          else res.status(200).json({ ok: true });
        });
      } else res.status(400).json({ error: "Codi de la cadira ja registracz en un altre cadira" });
    });
  }

  static async CadiraDelete(req, res) {
    const cadiraId = req.params.id;

    Cadira.findByIdAndRemove(cadiraId, function (err, deletedcadira) {
      if (err) res.status(400).json({ error: err.message });

      else res.status(200).json({ ok: true });
    });
  }


}
module.exports = cadiraController;