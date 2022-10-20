var Categoria = require("../models/categoria");

class CategoriaController {

    // Version 1
    static async list(req, res, next) {
        try {
            var list_categoria = await Categoria.find();
            console.log(list_categoria);
            res.render('categories/list', { list: list_categoria })
        }
        catch (e) {
            res.send('Error!');
        }
    }

}

module.exports = CategoriaController;
