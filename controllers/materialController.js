var Material = require('../models/material');
var Categoria = require('../models/categoria');
var fs = require('fs')

class MaterialController {
    static async list(req, res, next) {

        Material.find()
            .populate('codiCategoria')
            .exec(function (err, list) {
                if (err) {
                    return next(err);
                }
                res.render('materials/list', { list: list })
            });
    }

    static async create_get(req, res, next) {
        const list_material = await Material.find();
        const list_categoria = await Categoria.find();
        res.render('materials/new', { list: list_material, list_cat: list_categoria });
    }

    static async create_post(req, res) {
        const list_categoria = await Categoria.find();

        var list_material = {
            nom: req.body.nom,
            codi: req.body.codi,
            descripcio: req.body.descripcio,
            preuCompra: req.body.preuCompra,
            anyCompra: req.body.anyCompra,
            fotografia: req.file.path.substring(7, req.file.path.length),
            codiCategoria: req.body.codiCategoria
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
        const list_categoria = await Categoria.find();
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
            res.render("materials/update", { list: list_material, list_cat: list_categoria });
        });

    }

    static async update_post(req, res, next) {

        const list_categoria = await Categoria.find();

        var list_material = {
            nom: req.body.nom,
            codi: req.body.codi,
            descripcio: req.body.descripcio,
            preuCompra: req.body.preuCompra,
            anyCompra: req.body.anyCompra,
            //fotografia: req.file.path.substring(7, req.file.path.length),
            codiCategoria: req.body.codiCategoria,

            _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
        };

        Material.findByIdAndUpdate(
            req.params.id,
            list_material,
            { runValidators: true }, // Per a que faci les comprovacions de les restriccions posades al model
            function (err, list_materialfound) {
                if (err) {
                    res.render("materials/update", { list: list_material, list_cat: list_categoria, error: err.message });
                }
                res.render("materials/update", { list: list_material, list_cat: list_categoria, message: 'Material Updated' });
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
        
        if (req.file !== undefined) {
            
            var importData = async (model, dades) => {
                
                try {
                    await model.create(dades);
                    res.redirect('/materials');
                } catch (error) {
                    console.log(error)
                    res.render('materials/import', {message: error.message})
                }
                
            };
    
            var dades = JSON.parse(fs.readFileSync(req.file.path, "utf-8"));

            importData(Material, dades);
            
        } else{
            res.render("materials/import", { message: 'No has seleccionat cap fitxer' });
        }

        

    }
}

module.exports = MaterialController;