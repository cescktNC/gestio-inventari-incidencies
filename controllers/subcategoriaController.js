var Subcategoria = require("../models/subcategoria");
var Categoria = require("../models/categoria");

class SubcategoriaController {

  static async list(req, res, next) {
    Subcategoria.find()
      .populate('codiCategoria')
      .sort({ codiCategoria: 1, codi: 1 })
      .exec(function (err, list) {
        if (err) {
          return next(err);
        }
        res.render('subcategories/list', { list: list })
      });
  }

  static async create_get(req, res, next) {

    const categoria_list = await Categoria.find();
    res.render('subcategories/new', { categoriaList: categoria_list, })
  }

  static async create_post(req, res) {
    const categoria_list = await Categoria.find();
    const categoria = await Categoria.findById(req.body.codiCategoria);
    var subCategoria = {
      nom: req.body.nom,
      codi: req.body.codi + '/' + categoria.codi,
      codiCategoria: req.body.codiCategoria,
    }

    Subcategoria.create(subCategoria, function (error, newsubCategorias) {
      if (error) {
        res.render('subcategories/new', { error: error.message, categoriaList: categoria_list })
      } else {
        res.redirect('/subcategories')
      }
    })
  }

  static update_get(req, res, next) {
    Subcategoria.findById(req.params.id, function (err, subcategoria_list) {
      if (err) {
        return next(err);
      }
      if (subcategoria_list == null) {
        // No results.
        var err = new Error("Subcategoria no trobada");
        err.status = 404;
        return next(err);
      }
      // Success.
      res.render("subcategories/update", { subCategoria: subcategoria_list });
    });

  }
  static update_post(req, res, next) {
    var subCategoria = {
      nom: req.body.nom,
      codi: req.body.codi,
      // codiCategoria: req.params.codiCategoria,
      _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
    };

    Subcategoria.findByIdAndUpdate(
      req.params.id,
      subCategoria,
      { runValidators: true }, // Per a que faci les comprovacions de les restriccions posades al model
      function (err, subcategoriafound) {
        if (err) {
          //return next(err);
          res.render("subcategories/update", { subCategoria: subCategoria, error: err.message });
        }
        //res.redirect('/genres/update/'+ genreFound._id);
        res.render("subcategories/update", { subCategoria: subCategoria, message: 'Subcategoria actualitzada' });
      }
    );
  }
  static async delete_get(req, res, next) {

    res.render('subcategories/delete', { id: req.params.id })

  }

  static async delete_post(req, res, next) {

    Subcategoria.findByIdAndRemove(req.params.id, (error) => {
      if (error) {
        res.redirect('/subcategories')
      } else {
        res.redirect('/subcategories')
      }
    })
  }

}


module.exports = SubcategoriaController;
