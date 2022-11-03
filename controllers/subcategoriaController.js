var Subcategoria = require("../models/subcategoria");
var Categoria = require("../models/categoria");

class SubcategoriaController{
    
    static async list(req,res,next) {
        try {
          var list_subcategoria = await Subcategoria.find();
          res.render('subcategories/list', {list:list_subcategoria})   
        }
        catch(e) {
          res.send('Error!');
        }          
      }
   
      static async create_get(req, res, next) {

        const categoria_list = await Categoria.find();
        res.render('subcategorias/new',{categoriaList:categoria_list,})
      }
   
static async create_post(req, res) {
  // console.log(req.body)
  // req.body serà algo similar a  { name: 'Aventura' }
  const categoria_list = await Categoria.find();
  Subcategoria.create(req.body, function (error, newsubCategorias)  {
      if(error){
          res.render('subcategorias/new',{error:error.message, categoriaList:categoria_list})
      }else{             
          res.redirect('/subcategorias')
      }
  })    
}

static update_get(req, res, next) {
  Subcategoria.findById(req.params.id, function (err, subcategoria_list) {
      if (err) {
          return next(err);
      }
      if ( subcategoria_list == null) {
          // No results.
          var err = new Error("Subcategory not found");
          err.status = 404;
          return next(err);
      }
      // Success.
      res.render("subcategorias/update", { subCategoria:subcategoria_list });
  });

}
static update_post(req, res, next) {
  var subCategoria = {
      nom: req.body.nom,
      codi: req.body.codi,
     // codiCategoria: req.params.codiCategoria,
      _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
  }   ;

  Subcategoria.findByIdAndUpdate(
      req.params.id,
      subCategoria,
      {runValidators: true}, // Per a que faci les comprovacions de les restriccions posades al model
      function (err, subcategoriafound) {
          if (err) {
              //return next(err);
              res.render("subcategorias/update", { subCategoria: subCategoria, error: err.message });
          }          
          //res.redirect('/genres/update/'+ genreFound._id);
          res.render("subcategorias/update", { subCategoria: subCategoria, message: 'Subcategory Updated'});
      }
  );
}

}


module.exports = SubcategoriaController;
