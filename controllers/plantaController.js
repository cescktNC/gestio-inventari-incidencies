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
}

module.exports = plantaController;
