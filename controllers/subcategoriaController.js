var Subcategoria = require("../models/subcategoria");
var Categoria = require("../models/categoria");

class SubcategoriaController {

  static async list(req, res, next) {
    try {
      const PAGE_SIZE = 10; // Número de documentos por página
      const page = req.query.page || 1; // Número de página actual

      Subcategoria.countDocuments({}, function(err, count) {
        if (err) {
          return next(err);
        }

        const totalItems = count;
        const totalPages = Math.ceil(totalItems / PAGE_SIZE);
        const startIndex = (page - 1) * PAGE_SIZE;

        Subcategoria.find()
          .populate('codiCategoria')
          .sort({ codiCategoria: 1, codi: 1 })
          .skip(startIndex)
          .limit(PAGE_SIZE)
          .exec(function (err, list) {
            if (err) {
              return next(err);
            }
            res.render('subcategories/list', { list: list, totalPages: totalPages, currentPage: page });
          });
      });
    }
    catch (e) {
        res.send('Error!');
    }

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

  static async update_get(req, res, next) {
    const categoria_list = await Categoria.find();
    const categoria = await Categoria.findById(req.body.codiCategoria);
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
      res.render("subcategories/update", { subCategoria: subcategoria_list, categoriaList: categoria_list});
    });

  }

  static async update_post(req, res, next) {
    const categoria_list = await Categoria.find();
    const categoria = await Categoria.findById(req.body.codiCategoria);
    var subCategoria = {
      nom: req.body.nom,
      codi: req.body.codi + '/' + categoria.codi,
      codiCategoria: req.body.codiCategoria,
      _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
    };

    Subcategoria.findByIdAndUpdate(
      req.params.id,
      subCategoria,
      { runValidators: true }, // Per a que faci les comprovacions de les restriccions posades al model
      function (err, subcategoriafound) {
        if (err) {
          //return next(err);
          res.render("subcategories/update", { subCategoria: subCategoria, categoriaList: categoria_list, error: err.message });
        }
        //res.redirect('/genres/update/'+ genreFound._id);
        res.render("subcategories/update", { subCategoria: subCategoria, categoriaList: categoria_list, message: 'Subcategoria actualitzada' });
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
