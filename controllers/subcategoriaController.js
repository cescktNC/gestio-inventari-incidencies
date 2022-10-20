var Subcategoria = require("../models/subcategoria");

class SubcategoriaController{
    
    static async list(req,res,next) {
        try {
          var list_subcategoria = await Subcategoria.find();
          res.render('subcategorias/list',{list:list_subcategoria})   
        }
        catch(e) {
          res.send('Error!');
        }          
      }
}


module.exports = SubcategoriaController;
