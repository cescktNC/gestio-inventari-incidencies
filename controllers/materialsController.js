var Material = require('../models/material');
var SubCategoria = require('../models/subcategoria');
var fs = require('fs')

class MaterialController {
    static async list(req, res, next) {

        Material.find()
            .populate('codiSubCategoria')
            .sort({ codi: 1, codiSubCategoria: 1 })
            .exec(function (err, list) {
                if (err) {
                    return next(err);
                }
                res.render('materials/list', { list: list })
            });
    }

    static async create_get(req, res, next) {
        const list_material = await Material.find();
        const list_subcategoria = await SubCategoria.find();
        res.render('materials/new', { list: list_material, list_subcat: list_subcategoria });
    }

    static async create_post(req, res) {
        const list_categoria = await SubCategoria.find();
        const subcategoria = await SubCategoria.findById(req.body.codiCategoria);
        var list_material = {
            nom: req.body.nom,
            codi: req.body.codi + '-' + subcategoria.codi,
            descripcio: req.body.descripcio,
            preuCompra: req.body.preuCompra,
            anyCompra: req.body.anyCompra,
            fotografia: req.file.path.substring(7, req.file.path.length),
            codiSubCategoria: req.body.codiSubCategoria
        };

        Material.create(list_material, function (error, newMaterial) {
            if (error) {
                res.render('materials/new', { error: error.message, list_cat: list_categoria });
            } else {
                res.redirect('/materials');
            }
        });
    }

    static async update_get(req, res, next) {
        const list_subcategoria = await SubCategoria.find();
        Material.findById(req.params.id, function (err, list_material) {
            if (err) {
                return next(err);
            }
            if (list_material == null) {
                // No results.
                var err = new Error("No hem trobat el material");
                err.status = 404;
                return next(err);
            }
            // Success.
            res.render("materials/update", { list: list_material, list_cat: list_categoria });
        });

    }

    static async update_post(req, res, next) {

        const list_subcategoria = await SubCategoria.find();

        var list_material = {
            nom: req.body.nom,
            codi: req.body.codi,
            descripcio: req.body.descripcio,
            preuCompra: req.body.preuCompra,
            anyCompra: req.body.anyCompra,
            //fotografia: req.file.path.substring(7, req.file.path.length),
            codiCategoria: req.body.codiSubCategoria,

            _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
        };

        Material.findByIdAndUpdate(
            req.params.id,
            list_material,
            { runValidators: true }, // Per a que faci les comprovacions de les restriccions posades al model
            function (err, list_materialfound) {
                if (err) {
                    res.render("materials/update", { list: list_material, list_cat: list_subcategoria, error: err.message });
                }
                res.render("materials/update", { list: list_material, list_cat: list_subcategoria, message: 'Material actualitzat' });
            }
        );
    }

    static async delete_get(req, res, next) {

        res.render('materials/delete', { id: req.params.id })

    }

    static async delete_post(req, res, next) {

        Material.findByIdAndRemove(req.params.id, (error) => {
            if (error) {
                res.redirect('/materials')
            } else {
                res.redirect('/materials')
            }
        })
    }

    static async import_get(req, res, next) {

        res.render('materials/import')

    }

    static async import_post(req, res, next) {

        const importData = async (model, dades) => {
            console.log('a')
            try {
                console.log('b')
                await model.create(dades);
                console.log('a funcionat')
                res.redirect('/materials');
            } catch (error) {
                console.log(error.message)
                res.render('materials/import', { message: error.message })
            }

        };

        var dades = JSON.parse(fs.readFileSync(req.file.path, "utf-8"));
        importData(Material, dades);

    }
}

module.exports = MaterialController;