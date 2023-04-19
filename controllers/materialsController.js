var Material = require('../models/material');
var Exemplar = require('../models/exemplar');
var SubCategoria = require('../models/subcategoria');
var fs = require('fs');
const csv = require('csvtojson'); // Mòdul per a poder convertir un CSV a JSON

class MaterialController {
    static async list(req, res, next) {
        try {
            const PAGE_SIZE = 10; // Número de documentos por página
            const page = req.query.page || 1; // Número de página actual
            
            Material.countDocuments({}, function(err, count) {
                if (err) {
                    return next(err);
                }
        
                const totalItems = count;
                const totalPages = Math.ceil(totalItems / PAGE_SIZE);
                const startIndex = (page - 1) * PAGE_SIZE;
            
                Material.find()
                .sort({ codiSubCategoria: 1, codi: 1 })
                .populate('codiSubCategoria')
                .skip(startIndex)
                .limit(PAGE_SIZE)
                .exec(function (err, list) {
                    if (err) {
                        return next(err);
                    }
                    res.render('materials/list', { list: list, totalPages: totalPages, currentPage: page });
                });
            });
        }
        catch (e) {
            res.send('Error!');
        }
    }

    static async create_get(req, res, next) {
        const list_material = await Material.find();
        const list_subcategoria = await SubCategoria.find();
        res.render('materials/new', { list: list_material, list_cat: list_subcategoria });
    }

    static async create_post(req, res) {
        const list_categoria = await SubCategoria.find();
        const subcategoria = await SubCategoria.findById(req.body.codiSubCategoria);
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
            res.render("materials/update", { list: list_material, list_cat: list_subcategoria });
        });

    }

    static async update_post(req, res, next) {

        const list_subcategoria = await SubCategoria.find();
        const subcategoria = await SubCategoria.findById(req.body.codiSubCategoria);

        let list_material;

        if(req.file==null){
            list_material = {
                nom: req.body.nom,
                codi: req.body.codi + '-' + subcategoria.codi,
                descripcio: req.body.descripcio,
                preuCompra: req.body.preuCompra,
                anyCompra: req.body.anyCompra,
                codiSubCategoria: req.body.codiSubCategoria,
                _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
            };
        }else{
            list_material = {
                nom: req.body.nom,
                codi: req.body.codi + '-' + subcategoria.codi,
                descripcio: req.body.descripcio,
                preuCompra: req.body.preuCompra,
                anyCompra: req.body.anyCompra,
                fotografia: req.file.path.substring(7, req.file.path.length),
                codiSubCategoria: req.body.codiSubCategoria,
    
                _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
            };
        }

        

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

        Exemplar.find()
            .exec(function (err, list) {
                if (err) {
                    return next(err);
                }
                let exemplars = list.filter(exemplar => exemplar.codiMaterial ==  req.params.id);
                exemplars.forEach(exemplar => {
                    Exemplar.findByIdAndRemove(exemplar.id, (error) => {
                        if (error) {
                            res.redirect('/materials');
                        }
                    });
                });
            });

        Material.findByIdAndRemove(req.params.id, (error) => {
            if (error) {
                res.redirect('/materials');
            } else {
                res.redirect('/materials');
            }
        })

    }

    static async import_get(req, res, next) {
        res.render('materials/import')

    }

    static async import_post(req, res, next) {

        let filePath = req.file.path; 
        let jsonArray;

        if(filePath.slice(filePath.lastIndexOf('.')) == '.csv') {
            jsonArray = await csv().fromFile(filePath);
        } else {
            jsonArray = await JSON.parse(fs.readFileSync(filePath, "utf-8"));
        }

        let promesa = new Promise((resolve, reject) => {
            Material.create(jsonArray);
        });

        // Executo la promesa
        promesa
            .then(res.redirect('/materials')) // s'executa si es compleix la promesa
            .catch(error => res.render('materials/import', { message: error.message })); // s'executa si no es compleix la promesa

    }

    //API

    static async APIlist(req, res, next) {
        try {
            const PAGE_SIZE = 10; // Número de documentos por página
            const page = req.query.page || 1; // Número de página actual
            
            Material.countDocuments({}, function(err, count) {
                if (err) {
                    res.status(400).json({ error: err });
                }
        
                const totalItems = count;
                const totalPages = Math.ceil(totalItems / PAGE_SIZE);
                const startIndex = (page - 1) * PAGE_SIZE;
            
                Material.find()
                .sort({ codiSubCategoria: 1, codi: 1 })
                .populate('codiSubCategoria')
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

}

module.exports = MaterialController;