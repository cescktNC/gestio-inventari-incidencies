var Planta = require("../models/planta");
var Centre = require("../models/centre");

class plantaController{

    static async list(req, res, next) {
      Planta.find()
      .populate('codiCentre')
      .exec(function (err, list) {
          if (err) {
              return next(err);
          }
          res.render('planta/list', { list: list })
      });
}

      static async create_get(req, res, next) {

        const centre_list = await Centre.find();
        res.render('planta/new',{centreList:centre_list,})
      }
   
static async create_post(req, res) {
  // console.log(req.body)
  // req.body serà algo similar a  { name: 'Aventura' }
  const centre_list = await Centre.find();
  Planta.create(req.body, function (error, newPlanta)  {
      if(error){
          res.render('planta/new',{error:error.message, centreList:centre_list})
      }else{             
          res.redirect('/planta')
      }
  })    
}

static update_get(req, res, next) {
    Planta.findById(req.params.id, function (err, planta_list) {
        if (err) {
            return next(err);
        }
        if ( planta_list == null) {
            // No results.
            var err = new Error("Planta no trobada");
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render("planta/update", { Planta:planta_list });
    });
  
  }
  static update_post(req, res, next) {

    var planta = {
        codi: req.body.codi,
        planol: req.body.planol,
        _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
    }   ;

  
    Planta.findByIdAndUpdate(
        req.params.id,
        planta,
        {runValidators: true}, // Per a que faci les comprovacions de les restriccions posades al model
        function (err, Plantafound) {
            if (err) {
                //return next(err);
                res.render("planta/update", { Planta: Planta, error: err.message });
            }          
            //res.redirect('/genres/update/'+ genreFound._id);
            res.render("planta/update", { Planta: Planta, message: 'Planta Updated'});
        }
    );
  }

  static async delete_get(req, res, next) {
  
    res.render('planta/delete', { id: req.params.id })
  
  }
  
  static async delete_post(req, res, next) {
  
    Planta.findByIdAndRemove(req.params.id, (error) => {
        if (error) {
            res.redirect('/planta')
        } else {
            res.redirect('/planta')
        }
    })
  }
}

module.exports=plantaController;