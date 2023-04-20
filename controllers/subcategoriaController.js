var Subcategoria = require("../models/subcategoria");
var Categoria = require("../models/categoria");

class SubcategoriaController {

  static async list(req, res, next) {
    try {
      const PAGE_SIZE = 10; // Número de documentos por página
      const page = req.query.page || 1; // Número de página actual

      Subcategoria.countDocuments({}, function (err, count) {
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
      res.render("subcategories/update", { subCategoria: subcategoria_list, categoriaList: categoria_list });
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
  //API

  static async SubcategoryList(req, res, next) {
    try {

      const PAGE_SIZE = 10; // Número de documentos por página
      const page = req.query.page || 1; // Número de página actual

      Subcategoria.countDocuments({}, function (err, count) {
        if (err) {
          res.status(400).json({ error: err });
        }

        const totalItems = count;
        const totalPages = Math.ceil(totalItems / PAGE_SIZE);
        const startIndex = (page - 1) * PAGE_SIZE;

        Subcategoria.find()
          .sort({ codiCategoria: 1, codi: 1 })
          .populate('codiCategoria')
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

  static async SubcategoryAllList(req, res, next) {
    try {

      Subcategoria.find()
      .sort({ codiCategoria: 1, codi: 1 })
      .exec(function (err, list) {
        if (err) {
          res.status(400).json({ error: err });
        }
        res.status(200).json({ list: list });
      });
    }
    catch (e) {
      res.status(400).json({ error: 'Error!' });
    }
  }

  static async subCategoryCreate(req, res) {
    let subcategoriaNew = req.body.subcategoryData;
    Categoria.findById(subcategoriaNew.codiCategoria).exec(function(err, categoria){
      if (err) res.status(400).json({ error: err });
      if (categoria === undefined) res.status(400).json({ error: 'Categoria no trobada' });

      subcategoriaNew.codi = subcategoriaNew.codi + '/' + categoria.codi;
      // Valida que el código no esté ya registrado
      Subcategoria.findOne({ codi: subcategoriaNew.codi }, function (err, subcategoria) {
        if (err) res.status(400).json({ error: err });

        if (subcategoria == null) {
          // Guardar categoria en la base de datos
          Subcategoria.create(subcategoriaNew, function (error, newsubCategoria) {
            if (error) res.status(400).json({ error: error.message });

            else res.status(200).json({ ok: true });
          });
        } else res.status(400).json({ error: "Subcategoría ja registrada" });
      });
      
    });
    
  }

  static async subCategorySowh(req, res, next){
    Subcategoria.findById(req.params.id, function(err, subCategoria) {
      if (err) {
          res.status(400).json({ message: err });
      }
      if (subCategoria == null) {
          // No results.
          var err = new Error("Subcategoria not found");
          res.status(400).json({ message: err });

      }
      // Success.
      var subCategoriaJSON = {
          codi: subCategoria.codi,
          nom: subCategoria.nom,
          codiCategoria: subCategoria.codiCategoria
      };
      res.status(200).json({ subCategoria: subCategoriaJSON });
    })
  }

  static async subcategoryUpdate(req, res) {
    const subcategoryId = req.params.id;

    let codi = req.body.subcategoryData.codi;
    if(parseInt(codi) < 10) codi = '0' + req.body.subcategoryData.codiCategoria;
    const updatedsubCategoryData = new Subcategoria({
      _id: req.params.id,  
      nom: req.body.subcategoryData.nom,
      codi: codi,
      codiCategoria: req.body.subcategoryData.codiCategoria
    });

    Categoria.findById(updatedsubCategoryData.codiCategoria).exec(function(err, categoria){
      if (err) res.status(400).json({ error: err });
      if (categoria == null) res.status(400).json({ error: 'Categoria no trobada' });

      updatedsubCategoryData.codi = updatedsubCategoryData.codi + '/' + categoria.codi;
      // Valida que el código no esté ya registrado en otra categoría
      Subcategoria.findOne({ codi: updatedsubCategoryData.codi, _id: { $ne: subcategoryId } }, function (err, subcategoria) {
        if (err) res.status(400).json({ error: err });

        if (subcategoria == null) {
          // Actualizar la categoría en la base de datos
          Subcategoria.findByIdAndUpdate(subcategoryId, updatedsubCategoryData, { new: true }, function (error, updatedsubCategoria) {
            if (error) res.status(400).json({ error: error.message });

            else res.status(200).json({ ok: true });
          });
        } else res.status(400).json({ error: "Codi de subcategoría ja registrat en un altre subcategoria" });
      });
    });
  }

  static async subcategoryDelete(req, res) {
    const subcategoryId = req.params.id;

    Subcategoria.findByIdAndRemove(subcategoryId, function (err, deletedsubCategory) {
      if (err) res.status(400).json({ error: err.message });

      else res.status(200).json({ ok: true });
    });
  }

}



module.exports = SubcategoriaController;
