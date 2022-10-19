var mongoose = require("mongoose"); // Diem que utilitzem el paquet 'mongoose'

var Schema = mongoose.Schema; // Diem que utilitzarem esquemes per a les collecions de MongoDB

var SubcategoriaSchema = new Schema({ // Diem que creem un nou esquema per a les collecions de MongoDB
    
    nom :{ type: String, required: true },
    codi :{ type: Number, required: true },
    codiCcategoria : [{ type: Schema.ObjectId, ref: "Codi" }],

});


// Export model.
module.exports = mongoose.model("Subcategoria", SubcategoriaSchema);    // Creo el model esquema per a poder-lo utilitzar
                                                       
