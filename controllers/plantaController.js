var Planta = require("../models/planta");
var Centre = require("../models/centre");

class plantaController {
	static async list(req, res, next) {
		try {
			const PAGE_SIZE = 10; // Número de documentos por página
			const page = req.query.page || 1; // Número de página actual
			
            Planta.countDocuments({}, function(err, count) {
                if (err) {
                    return next(err);
                }
        
                const totalItems = count;
                const totalPages = Math.ceil(totalItems / PAGE_SIZE);
                const startIndex = (page - 1) * PAGE_SIZE;
            
                Planta.find()
                .sort({ codiCentre: 1, codi: 1 })
                .populate('codiCentre')
                .skip(startIndex)
                .limit(PAGE_SIZE)
                .exec(function (err, list) {
                    if (err) {
                        return next(err);
                    }
                    res.render('planta/list', { list: list, totalPages: totalPages, currentPage: page });
                });
            });
        }
        catch (e) {
            res.send('Error!');
        }
	}

	static async create_get(req, res, next) {
		const centre_list = await Centre.find();
		res.render("planta/new", { centreList: centre_list });
	}

	static async create_post(req, res) {
		const centre_list = await Centre.find();
		const centre = await Centre.findById(req.body.codiCentre);
		var planta = {
			codi: req.body.codi + "/" + centre.codi,
			nom: req.body.nom,
			codiCentre: req.body.codiCentre,
			planol: req.file.path.substring(7, req.file.path.length),
		};

		Planta.create(planta, function (error, newPlanta) {
			if (error) {
				res.render("planta/new", {
					error: error.message,
					centreList: centre_list
				});
			} else {
				res.redirect("/planta");
			}
		});
	}

	static async update_get(req, res, next) {
		const centre_list = await Centre.find();
		Planta.findById(req.params.id, function (err, planta_list) {
			if (err) {
				return next(err);
			}
			if (planta_list == null) {
				// No results.
				var err = new Error("Planta no trobada");
				err.status = 404;
				return next(err);
			}
			// Success.
			res.render("planta/update", { Planta: planta_list, centreList: centre_list });
		});
	}

	static async update_post(req, res, next) {
		const centre_list = await Centre.find();
		const centre = await Centre.findById(req.body.codiCentre);
		var planta;

		if (req.file == undefined) {
			planta = {
				codi: req.body.codi + "/" + centre.codi,
				_id: req.params.id,
			};
		} else {
			planta = {
				codi: req.body.codi + "/" + centre.codi,
				_id: req.params.id,
				planol: req.file.path.substring(7, req.file.path.length),

			};
		}

		Planta.findByIdAndUpdate(
			req.params.id,
			planta,
			{ runValidators: true }, // Per a que faci les comprovacions de les restriccions posades al model
			function (err, Plantafound) {
				if (err) {
					//return next(err);
					res.render("planta/update", { Planta: planta, centreList: centre_list, error: err.message });
				}
				//res.redirect('/genres/update/'+ genreFound._id);
				res.render("planta/update", {
					Planta: planta,
					centreList: centre_list,
					message: "Planta actualitzada",
				});
			},
		);
	}

	static async delete_get(req, res, next) {
		res.render("planta/delete", { id: req.params.id });
	}

	static async delete_post(req, res, next) {
		Planta.findByIdAndRemove(req.params.id, error => {
			if (error) {
				res.redirect("/planta");
			} else {
				res.redirect("/planta");
			}
		});
	}

	static async PlantaList(req, res, next) {
		try {
	
			const PAGE_SIZE = 10; // Número de documentos por página
			const page = req.query.page || 1; // Número de página actual
	
			Planta.countDocuments({}, function (err, count) {
			if (err) {
				res.status(400).json({ error: err });
			}
	
			const totalItems = count;
			const totalPages = Math.ceil(totalItems / PAGE_SIZE);
			const startIndex = (page - 1) * PAGE_SIZE;
	
			Planta.find()
				.sort({ codiCentre:1, codi: 1 })
				.populate({
					path: 'codiCentre',
					select: 'nom'
				})
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

	static async PlantaAllList(req, res){
		try {
			Planta.find()
			.sort({ codiCentre:1, codi: 1 })
			.exec(function (err, list) {
				if (err) {
				res.status(400).json({ error: err });
				}
				res.status(200).json({ list: list });
			});

		} catch (error) {
			res.status(400).json({ error: error });
		}
	}
	
	static async PlantaCreate(req, res) {
		try {
			let centre = await Centre.findById(req.body.codiCentre).exec();
			if(centre === null || centre === undefined) return res.status(400).json({error: 'Centre no trobat'});

			let codi = await Planta.find({codiCentre: req.body.codiCentre}).count() + 1;
			if(codi < 10) codi = '0' + codi;

			let planta = {
				codi: codi + "/" + centre.codi,
				nom: req.body.nom,
				codiCentre: req.body.codiCentre,
				planol: req.file.path.substring(7, req.file.path.length)
			};

			Planta.create(planta, function (error, newcennewplantatre) {
				if (error) res.status(400).json({ errors: error.errors });
		
				else res.status(200).json({ ok: true });
			});
		} catch (error) {
			res.status(400).json({ error: 'Ha ocurregut un error inesperat' });
		}
		
	}

	static async PlantaUpdate(req, res) {
		try {

			const PlantaId = req.params.id;
			let planta = {...req.body};

			if(planta.newCodicentre !== planta.codiCentre){
				console.log('a')
				let centre = await Centre.findById(planta.newCodicentre).exec();
				if(centre === null || centre === undefined) return res.status(400).json({error: 'Centre no trobat'});

				let codi = await Planta.find({codiCentre: planta.newCodicentre}).count() + 1;
				if(codi < 10) codi = '0' + codi;

				planta.codi = codi + "/" + centre.codi;
				planta.codiCentre = planta.newCodicentre;
			} 

			if(req.file != undefined){
				planta.planol = req.file.path.substring(7, req.file.path.length);
			}

			Planta.findByIdAndUpdate(PlantaId, planta, { new: true }, function (error, updatedplanta) {
				if (error) {
					res.status(400).json({ errors: error.message });
				}
		
				else res.status(200).json({ ok: true });
			});
		} catch (error) {
			res.status(400).json({ error: 'Ha ocurregut un error inesperat' });
		}

	}
	
	static async PlantaDelete(req, res) {
		const PlantaId = req.params.id;
	
		Planta.findByIdAndRemove(PlantaId, function (err, deletedplanta) {
			if (err) res.status(400).json({ error: err.message });
		
			else res.status(200).json({ ok: true });
		});
	}

	static async PlantaSowh(req, res, next){
        Planta.findById(req.params.id)
        .populate('codiCentre')
        .exec(function(err, planta) {
            if (err) {
                return res.status(400).json({ error: err });
            }
            if (planta == null) {
                // No results.
                return res.status(400).json({ error: "Planta not found" });
            }

            res.status(200).json({ planta });

        })
    }
}

module.exports = plantaController;
