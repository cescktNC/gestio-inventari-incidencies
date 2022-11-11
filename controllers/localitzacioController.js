var Localitzacio = require("../models/localitzacio");
var Centre = require("../models/centre");

class LocalitzacioController{

    static async list(req,res,next) {
      Localitzacio.find()
      .populate('codiCentre')
      .exec(function (err, list) {
          if (err) {
              return next(err);
          }
          res.render('localitzacio/list', { list: list })
      });
}

      static async create_get(req, res, next) {

        const centre_list = await Centre.find();
        res.render('localitzacio/new',{centreList:centre_list,})
      }
   
static async create_post(req, res) {
  // console.log(req.body)
  // req.body serà algo similar a  { name: 'Aventura' }
  const centre_list = await Centre.find();
  Localitzacio.create(req.body, function (error, newLocalitzacio)  {
      if(error){
          res.render('localitzacio/new',{error:error.message, centreList:centre_list})
      }else{             
          res.redirect('/localitzacio')
      }
  })    
}

static update_get(req, res, next) {
    Localitzacio.findById(req.params.id, function (err, localitzacio_list) {
        if (err) {
            return next(err);
        }
        if ( localitzacio_list == null) {
            // No results.
            var err = new Error("No hem pogut trobar la localització que ens indiques");
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render("localitzacio/update", { Localitzacio:localitzacio_list });
    });
  
  }
  static update_post(req, res, next) {

    if(req.body.especial===undefined) req.body.especial=false;
    var localitzacio = {
        codi: req.body.codi,
        nom: req.body.nom,
        especial: req.body.especial,
        _id: req.params.id,  // Necessari per a que sobreescrigui el mateix objecte!
    }   ;

    console.log(localitzacio)
  
    Localitzacio.findByIdAndUpdate(
        req.params.id,
        localitzacio,
        {runValidators: true}, // Per a que faci les comprovacions de les restriccions posades al model
        function (err, localitzaciofound) {
            if (err) {
                //return next(err);
                res.render("localitzacio/update", { Localitzacio: Localitzacio, error: err.message });
            }          
            //res.redirect('/genres/update/'+ genreFound._id);
            res.render("localitzacio/update", { Localitzacio: Localitzacio, message: 'Localitzacio actualitzada'});
        }
    );
  }
  static async delete_get(req, res, next) {
  
    res.render('localitzacio/delete', { id: req.params.id })
  
  }
  
  static async delete_post(req, res, next) {
  
    Localitzacio.findByIdAndRemove(req.params.id, (error) => {
        if (error) {
            res.redirect('/localitzacio')
        } else {
            res.redirect('/localitzacio')
        }
    })
  }
}

module.exports = LocalitzacioController;