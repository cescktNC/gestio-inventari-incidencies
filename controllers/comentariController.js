var Comentari = require("../models/comentari");
var Usuari = require("../models/usuari");
var Tramet = require("../models/tramet");
var id_incidencia;

class ComentariController {
	static async list(req, res, next) {
		try {
			var list_comentari = await Comentari.find({
				codiIncidencia: req.params.id,
			})
				.sort({ data: 1 })
				.populate("codiIncidencia")
				.populate("codiUsuari");
			id_incidencia = req.params.id;
			res.render("comentari/list", { list: list_comentari });
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
}

module.exports = ComentariController;
