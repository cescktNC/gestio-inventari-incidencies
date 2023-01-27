var Comentari = require("../models/comentari");
var Usuari = require('../models/usuari');
var id_incidencia;

class ComentariController {

  static async list(req, res, next) {
    try {
      var list_comentari = await Comentari.find({ codiIncidencia: req.params.id }).sort({ data: 1 })
      .populate('codiIncidencia')
      .populate('codiUsuari');
      id_incidencia = req.params.id;
      console.log(list_comentari);
      console.log(id_incidencia);
      res.render('comentari/list', { list: list_comentari })
    }
    catch (e) {
      console.log('b');
      next(e)
      //res.send(e);
    }
  }

  static async create_get(req, res, next) {
    console.log('a');
       
    var list_usuari = await Usuari.find();
    res.render('comentari/new', { list: list_usuari });
  }

  static create_post(req, res, next) {
    var comentari = {
      codiIncidencia: id_incidencia,
      codiUsuari: req.body.codiUsuari,
      data: Date.now(),
      descripcio: req.body.descripcio
    }

    Comentari.create(comentari, (error, newRecord) => {
      if (error) {
        res.render('comentari/new', { error: 'error' })
      } else {

        res.redirect('/comentari/list/'+id_incidencia)
      }
    })
  }
}

module.exports = ComentariController;