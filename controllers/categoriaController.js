var Categoria = require("../models/categoria");

class CategoriaController {

    static async list(req, res, next) {
        try {
            const PAGE_SIZE = 10; // Número de documentos por página
            const page = req.query.page || 1; // Número de página actual

            Categoria.countDocuments({}, function (err, count) {
                if (err) {
                    return next(err);
                }

                const totalItems = count;
                const totalPages = Math.ceil(totalItems / PAGE_SIZE);
                const startIndex = (page - 1) * PAGE_SIZE;

                Categoria.find()
                    .sort({ codi: 1 })
                    .skip(startIndex)
                    .limit(PAGE_SIZE)
                    .exec(function (err, list) {
                        if (err) {
                            return next(err);
                        }
                        res.render('categories/list', { list: list, totalPages: totalPages, currentPage: page });
                    });
            });
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
            { runValidators: true }, // comportament per defecte: buscar i modificar si el troba sense validar l'Schema
            function (err, list_categoriaFound) {
                if (err) {

                    res.render("categories/update", { list: list_categoria, error: err.message });

                }

                res.render("categories/update", { list: list_categoria, message: 'Categoria actualitzada' });
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

    //API

    static async categoryList(req, res, next) {
        try {

            const PAGE_SIZE = 10; // Número de documentos por página
            const page = req.query.page || 1; // Número de página actual

            Categoria.countDocuments({}, function (err, count) {
                if (err) {
                    res.status(400).json({ error: err });
                }

                const totalItems = count;
                const totalPages = Math.ceil(totalItems / PAGE_SIZE);
                const startIndex = (page - 1) * PAGE_SIZE;

                Categoria.find()
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

    static async categoryCreate(req, res) {
        let categoriaNew = req.body.categoryData  
        ;

        // Valida que el código no esté ya registrado
        Categoria.findOne({ codi: categoriaNew.codi }, function (err, categoria) {
            if (err) res.status(400).json({ error: err });

            if (categoria == null) {
                // Guardar categoria en la base de datos
                Categoria.create(categoriaNew, function (error, newCategoria) {
                    if (error) res.status(400).json({ error: error.message });

                    else res.status(200).json({ ok: true });
                });
            } else res.status(400).json({ error: "Categoría ja registrada" });
        });
    }
    static async categoryUpdate(req, res) {
        const categoryId = req.params.id;
        const updatedCategoryData = req.body.categoryData;
        

        // Valida que el código no esté ya registrado en otra categoría
        Categoria.findOne({ codi: updatedCategoryData.codi, _id: { $ne: categoryId } }, function (err, categoria) {
            if (err) res.status(400).json({ error: err });

            if (categoria == null) {
                // Actualizar la categoría en la base de datos
                Categoria.findByIdAndUpdate(categoryId, updatedCategoryData, { new: true }, function (error, updatedCategoria) {
                    if (error) res.status(400).json({ error: error.message });

                    else res.status(200).json({ ok: true });
                });
            } else res.status(400).json({ error: "Codi de categoría ja registrat en un altre categoria" });
        });
    }

    static async categoryDelete(req, res) {
        const categoryId = req.params.id;

        Categoria.findByIdAndRemove(categoryId, function (err, deletedCategory) {
            if (err) res.status(400).json({ error: err.message });

            else res.status(200).json({ ok: true });
        });
    }

}

module.exports = CategoriaController;
