var Comentari = require("../models/comentari");

class ComentariController {

  static async list(req, res, next) {
    try {
      var list_comentari = await Comentari.find({codiIncidencia: req.params.id}).sort({ data: 1 });
      res.render('comentari/list', { list: list_comentari })
    }
    catch (e) {
      res.send('Error!');
    }
  }}

  module.exports = ComentariController;