var Cadira = require("../models/cadira");
var Sessio = require("../models/sessio");

class cadiraController {

  static async list(req, res, next) {
    Cadira.find()
    .populate('codiSessio')
    .exec(function (err, list) {
        if (err) {
            return next(err);
        }
        res.render('cadira/list', { list: list })
    });
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

}
module.exports=cadiraController;