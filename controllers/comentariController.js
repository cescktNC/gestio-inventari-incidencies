var Comentari = require("../models/comentari");
var Usuari = require("../models/usuari");
var Tramet = require("../models/tramet");
var id_incidencia;

class ComentariController {
	static async list(req, res, next) {
		try {
			const PAGE_SIZE = 10; // Número de documentos por página
			const page = req.query.page || 1; // Número de página actual
			
			Comentari.countDocuments({codiIncidencia: req.params.id}, function(err, count) {
				if (err) {
					return next(err);
				}
		
				const totalItems = count;
				const totalPages = Math.ceil(totalItems / PAGE_SIZE);
				const startIndex = (page - 1) * PAGE_SIZE;
			
				Comentari.find({codiIncidencia: req.params.id})
				.sort({ data: 1 })
				.populate("codiIncidencia")
				.populate("codiUsuari")
				.skip(startIndex)
				.limit(PAGE_SIZE)
				.exec(function (err, list) {
					if (err) {
						return next(err);
					}
					id_incidencia = req.params.id;
					res.render('comentari/list', { list: list, totalPages: totalPages, currentPage: page });
				});
			});
		} catch (e) {
			next(e);
			//res.send(e);
		}
	}

	static async create_get(req, res, next) {
		var list_usuari = await Usuari.find();
		res.render("comentari/new", { list: list_usuari });
	}

	static create_post(req, res, next) {
		var comentari = {
			codiIncidencia: id_incidencia,
			codiUsuari: req.session.data.usuariId,
			data: Date.now(),
			descripcio: req.body.descripcio,
		};

		Comentari.create(comentari, async (error, newRecord) => {
			if (error) {
				res.render("comentari/new", { error: "error" });
			} else {

				var tramet = {
					codiIncidencia: newRecord.codiIncidencia,
					codiUsuari: newRecord.codiUsuari,
					codiComentari: newRecord.id
				};

				Tramet.create(tramet);

				res.redirect("/comentari/list/" + id_incidencia);
			}
		});

	}

	static async ComentariList(req, res, next) {
		try {
	
		  const PAGE_SIZE = 10; // Número de documentos por página
		  const page = req.query.page || 1; // Número de página actual
	
		  Comentari.countDocuments({}, function (err, count) {
			if (err) {
			  res.status(400).json({ error: err });
			}
			
			const totalItems = count;
			const totalPages = Math.ceil(totalItems / PAGE_SIZE);
			const startIndex = (page - 1) * PAGE_SIZE;

			Comentari.find({codiIncidencia: req.params.id})
			  .sort({ data: -1 })
			  .populate('codiUsuari')
			  .populate("codiIncidencia")
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

	  static async ComentariCreate(req, res) {
		let com = new Comentari({
		  codiIncidencia:req.body.comentari.codiIncidencia,
		  codiUsuari: req.body.comentari.codiUsuari,
		  data: Date.now(),
		  descripcio: req.body.comentari.descripcio
		});
  
		
		Comentari.create(com, function (error, newcomen ) {
			if (error) res.status(400).json({ error: error.message });

			else res.status(200).json({ ok: true });
		});
	  }
		
	  
}

module.exports = ComentariController;
