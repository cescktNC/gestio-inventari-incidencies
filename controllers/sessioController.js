var Sessio = require('../models/sessio');

class sessioController{

    static async list(req,res,next) {
        try {
          var list_sessio = await Sessio.find();
          res.render('sessio/list',{list:list_sessio})   
        }
        catch(e) {
          res.send('Error!');
        }          
      }


}

module.exports=sessioController;