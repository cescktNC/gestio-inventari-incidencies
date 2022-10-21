var Categoria = require("../models/categoria");

class CategoriaController {

    // Version 1
    static async list(req, res, next) {
        try {
            var list_categoria = await Categoria.find();
            console.log(list_categoria);
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
                var err = new Error("Categoria not found");
                err.status = 404;
                return next(err);
            }
            // Success.
            res.render("categories/update", { list: list_categoria });
        });

    }

    static update_post(req, res, next) {
        var list_categoria = {
            name: req.body.name,
            codi: req.body.codi,
            _id: req.params.id,
        };

        Categoria.findByIdAndUpdate(
            req.params.id,
            list_categoria,
            {},
            function (err, thecategories) {
                if (err) {

                    res.render("categories/update", { list: list_categoria, error: err.message });

                }

                res.render("categories/update", { list: list_categoria, message: 'Categoria Updated' });
                //res.redirect("/categories");

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
