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

    static async materialCreate(req, res) {
        SubCategoria.findById(req.body.codiSubCategoria).exec(function(err, subCategoria){
            if(err) res.status(400).json({error: err});
            if(subCategoria === null) res.status(400).json({error: 'Subcategoria no trobada'});

            let codi = req.body.codi;
            if(parseInt(codi) < 10) codi = '0' + codi;

            let materialNew ={
                nom: req.body.nom,
                codi: codi + '-' + subCategoria.codi,
                descripcio: req.body.descripcio,
                preuCompra: req.body.preuCompra,
                anyCompra: req.body.anyCompra,
                fotografia: req.file.path.substring(7, req.file.path.length),
                codiSubCategoria: req.body.codiSubCategoria
            }
            
            Material.findOne({ codi: materialNew.codi }, function (err, centre) {
                if (err) res.status(400).json({ error: err });

                if (centre == null) {
                // Guardar categoria en la base de datos
                    Material.create(materialNew, function (error, newcentre) {
                        if (error) res.status(400).json({ error: error.message });
            
                        else res.status(200).json({ ok: true });
                    });
                } else res.status(400).json({ error: "Material ja registrat" });
            });
        });

    }

    static async materialSowh(req, res, next){
        Material.findById(req.params.id)
        .populate('codiSubCategoria')
        .exec(function(err, material) {
            if (err) {
                res.status(400).json({ message: err });
            }
            if (material == null) {
                // No results.
                var err = new Error("Material not found");
                res.status(400).json({ message: err });
            }

            
            res.status(200).json({ material: material });

            // Success.
            var materialJSON = {
                codi: material.codi,
                nom: material.nom,
                descripcio: material.descripcio,
                preuCompra: material.preuCompra,
                anyCompra: material.anyCompra,
                fotografia: material.fotografia,
            };
            res.status(200).json({ material: materialJSON });
        });
    }

    static async materialUpdate(req, res, next) {

        SubCategoria.findById(req.body.codiSubCategoria).exec(function(err, subCategoria){
            if(err) res.status(400).json({error: err});
            if(subCategoria === null || subCategoria === undefined) res.status(400).json({error: 'Subcategoria no trobada'});

            let codi = req.body.codi;

            if(parseInt(codi) < 10) codi = '0' + codi;

            let material;

            if(req.file == null){
                material = {
                    nom: req.body.nom,
                    codi: codi + '-' + subCategoria.codi,
                    descripcio: req.body.descripcio,
                    preuCompra: req.body.preuCompra,
                    anyCompra: req.body.anyCompra,
                    codiSubCategoria: req.body.codiSubCategoria,
                    _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
                };
            } else {
                material = {
                    nom: req.body.nom,
                    codi: codi + '-' + subCategoria.codi,
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
                material,
                { runValidators: true }, // comportament per defecte: buscar i modificar si el troba sense validar l'Schema
                function (err, materialFound) {

                    if (err) res.status(400).json({ material: material, error: err.message });

                    res.status(400).json({ id: materialFound.id, ok: true, message: 'Usuari actualitzat correctament' });
                }
            );   
        });   
        let codi = req.body.codi;
        if(parseInt(codi) < 10) codi = '0' + codi;
        let material;
        if(req.file==null){
            list_material = {
                nom: req.body.nom,
                codi: codi + '-' + subcategoria.codi,
                descripcio: req.body.descripcio,
                preuCompra: req.body.preuCompra,
                anyCompra: req.body.anyCompra,
                codiSubCategoria: req.body.codiSubCategoria,
                _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
            };
        }else{
            list_material = {
                nom: req.body.nom,
                codi: codi + '-' + subcategoria.codi,
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
            material,
            { runValidators: true }, // comportament per defecte: buscar i modificar si el troba sense validar l'Schema
            function (err, materialFound) {

                if (err) res.status(400).json({ material: material, error: err.message });

                res.status(400).json({ id: materialFound.id, ok: true, message: 'Usuari actualitzat correctament' });
            }
        );
        
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
                console.log(element);
            
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