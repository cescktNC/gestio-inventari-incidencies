var Material = require('../models/material');
var Categoria = require('../models/categoria');

class MaterialController {
    static async list(req, res, next) {
        try {
            var list_material = await Material.find();
            res.render('materials/list', { list: list_material })
        }
        catch (e) {
            res.send('Error!');
        }
    }

    static async create_get(req, res, next) {

        const list_material = await Material.find();
        const list_categoria = await Categoria.find();
        res.render('materials/new', { list: list_material, list_cat: list_categoria });
    }

    static async create_post(req, res) {
        // console.log(req.body)
        // req.body serà algo similar a  { name: 'Aventura' }
        const list_material = await Categoria.find();
        Material.create(req.body, function (error, newMaterial) {
            if (error) {
                res.render('materials/new', { error: error.message, list: list_material })
            } else {
                res.redirect('/materials')
            }
        })
    }

    static update_get(req, res, next) {
        Material.findById(req.params.id, function (err, list_material) {
            if (err) {
                return next(err);
            }
            if (list_material == null) {
                // No results.
                var err = new Error("Material not found");
                err.status = 404;
                return next(err);
            }
            // Success.
            res.render("materials/update", { list: list_material });
        });

    }
    static update_post(req, res, next) {
        var list_material = {
            nom: req.body.nom,
            codi: req.body.codi,
            descripcio: req.body.descripcio,
            preuCompra: req.body.preuCompra,

            // codiCategoria: req.params.codiCategoria,
            _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
        };

        list_material.findByIdAndUpdate(
            req.params.id,
            list_material,
            { runValidators: true }, // Per a que faci les comprovacions de les restriccions posades al model
            function (err, list_materialfound) {
                if (err) {
                    //return next(err);
                    res.render("materials/update", { list: list_material, error: err.message });
                }
                //res.redirect('/genres/update/'+ genreFound._id);
                res.render("materials/update", { list: list_material, message: 'material Updated' });
            }
        );
    }
}

module.exports = MaterialController;