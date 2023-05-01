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

    static async materiaLlist(req, res, next) {
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
                .populate({
                    path: 'codiSubCategoria',
                    select: 'nom'
                })
                .skip(startIndex)
                .limit(PAGE_SIZE)
                .exec(function (err, list) {
                    if (err) res.status(400).json({ error: err });
                    
                    else res.status(200).json({ list: list, totalPages: totalPages, currentPage: page });
                });
            });
        }
        catch (e) {
            res.status(400).json({ error: e });
        }
    }

    static async materiaAllLlist(req, res, next) {
        try {
            Material.find()
            .exec(function (err, list) {
                if (err) res.status(400).json({ error: err });
                
                else res.status(200).json({ list: list });
            });
        }
        catch (e) {
            res.status(400).json({ error: e });
        }
    }

    static async materialCreate(req, res) {

        try {
            let material = req.body;
            let subCategoria = await SubCategoria.findById(material.codiSubCategoria).exec();
            if(subCategoria === null) res.status(400).json({error: 'Subcategoria no trobada'});

            material.codi = await Material.find({codiSubCategoria: material.codiSubCategoria}).count() + 1;
            if(material.codi < 10) material.codi = '0' + material.codi;
            material.codi = material.codi + '-' + subCategoria.codi;

            Material.create(material, function (error, newcentre) {
                if (error) res.status(400).json({ error: error.message });
    
                else res.status(200).json({ ok: true });
            });

        } catch (error) {
            res.status(400).json({ error });     
        }
    }

    static async materialSowh(req, res, next){
        Material.findById(req.params.id)
        .populate({
            path: 'codiSubCategoria',
            select: 'nom'
        })
        .exec(function(err, material) {
            if (err) {
                res.status(400).json({ error: err });
            }
            if (material == null) {
                // No results.
                res.status(400).json({ error: "Material not found" });
            }
            
            res.status(200).json({ material: material });

        });
    }

    static async materialUpdate(req, res, next) {

        try {
            let material;

            if(req.file == null){
                material = {
                    nom: req.body.nom,
                    descripcio: req.body.descripcio,
                    preuCompra: req.body.preuCompra,
                    anyCompra: req.body.anyCompra,
                    codiSubCategoria: req.body.codiSubCategoria,
                    newCodiSubCategoria: req.body.newCodiSubCategoria,
                    _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
                };
            } else {
                material = {
                    nom: req.body.nom,
                    descripcio: req.body.descripcio,
                    preuCompra: req.body.preuCompra,
                    anyCompra: req.body.anyCompra,
                    fotografia: req.file.path.substring(7, req.file.path.length),
                    codiSubCategoria: req.body.codiSubCategoria,
                    newCodiSubCategoria: req.body.newCodiSubCategoria,
                    _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
                };
            };

            if(material.newCodiSubCategoria !== material.codiSubCategoria){
                let subCategoria = await SubCategoria.findById(material.newCodiSubCategoria).exec();

                material.codi = await Material.find({codiSubCategoria: material.newCodiSubCategoria}).count() + 1;
                if(material.codi < 10) material.codi = '0' + material.codi;

                material.codi = material.codi + '-' + subCategoria.codi;
                material.codiSubCategoria = material.newCodiSubCategoria

            }

            Material.findByIdAndUpdate(material._id,
                material,
                { runValidators: true }, // comportament per defecte: buscar i modificar si el troba sense validar l'Schema
                function (err, materialFound) {

                    if (err) res.status(400).json({ errors: err.message });

                    res.status(400).json({ id: materialFound.id, ok: true, message: '' });
                }
            ); 
        } catch (error) {
            res.status(400).json({ error });
        }
        
    };

    static async materialDelete(req, res, next) {
        Material.findByIdAndRemove(req.params.id, function (error) {
            if (error) {
                res.status(400).json({ error });
            } else {
                res.status(200).json({ ok: true, message: 'Material eliminat' });
            }
        });
    };

    static async materialImport(req, res, next) {

        let filePath = req.file.path; 
        let jsonArray;

        if(filePath.slice(filePath.lastIndexOf('.')) == '.csv') {
            jsonArray = await csv().fromFile(filePath);
        } else {
            jsonArray = await JSON.parse(fs.readFileSync(filePath, "utf-8"));
        }
            let count = 0;

            jsonArray.forEach(async element => {

                const subCategoria = await SubCategoria.findOne({ nom: element.nomSubCategoria });


                if (subCategoria === null || subCategoria === undefined) {
                    res.status(400).json({error: 'Subcategoria no trobada'});
                }
            
                element.codi += '-' + subCategoria.codi;
                element.codiSubCategoria = subCategoria._id;
            
                count++;
            
                if (count == jsonArray.length) {
                    Material.create(jsonArray, function(error){
                        if(error) res.status(400).json({error: error});
                        else res.status(200).json({ok: true})
                    });
                }
            });

        let promesa = new Promise((resolve, reject) => {
            Material.create(jsonArray);
        });

        // Executo la promesa
        promesa
            .then(res.status(200).json({ok: true})) // s'executa si es compleix la promesa
            .catch(error => res.status(400).json({ message: error.message })); // s'executa si no es compleix la promesa


    }

}

module.exports = MaterialController;