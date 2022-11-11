var Categoria = require("../models/categoria");

class CategoriaController {

    static async list(req, res, next) {
        try {
            var list_categoria = await Categoria.find();
            res.render('categories/list', { list: list_categoria })
        }
        catch (e) {
            res.send('Error!');
        }
    }

    static async create_get(req, res, next) {
        res.render('categories/new')
    }

    static create_post(req, res, next) {

        Categoria.create(req.body, (error, newRecord) => {
            if (error) {
                res.render('categories/new', { error: 'error' })
            } else {

                res.redirect('/categories')
            }
        })
    }

    static update_get(req, res, next) {
        Categoria.findById(req.params.id, function (err, list_categoria) {
            if (err) {
                return next(err);
            }
            if (list_categoria == null) {
                // No results.
                var err = new Error("Aquesta categoria no existeix");
                err.status = 404;
                return next(err);
            }
            // Success.
            res.render("categories/update", { list: list_categoria });
        });

    }

    static update_post(req, res, next) {
        var list_categoria = new Categoria({
            nom: req.body.nom,
            codi: req.body.codi,
            _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
          });    
        
          Categoria.findByIdAndUpdate(
            req.params.id,
            list_categoria,
            {runValidators: true}, // comportament per defecte: buscar i modificar si el troba sense validar l'Schema
            function (err, list_categoriaFound) {
              if (err) {
                
                res.render("categories/update", { list: list_categoria, error: err.message });
    
              }          
              
              res.render("categories/update", { list: list_categoria, message: 'Categoria actualitzada'});
            }
          );
    }

    static async delete_get(req, res, next) {

        res.render('categories/delete', { id: req.params.id })

    }

    static async delete_post(req, res, next) {

        Categoria.findByIdAndRemove(req.params.id, (error) => {
            if (error) {
                res.redirect('/categories')
            } else {
                res.redirect('/categories')
            }
        })
    }

}

module.exports = CategoriaController;
