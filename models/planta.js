var mongoose = require("mongoose"); // Diem que utilitzem el paquet 'mongoose'

var Schema = mongoose.Schema; // Diem que utilitzarem esquemes per a les collecions de MongoDB

var PlantaSchema = new Schema({ // Diem que creem un nou esquema per a les collecions de MongoDB

    codi: { type: String, required: true, unique: true },
    nom: {type:String, required: true, unique: true },
    codiCentre: { type: Schema.ObjectId, ref: "Centre" },
    planol: { type: String, required: true },

});


// Export model.
module.exports = mongoose.model("Planta", PlantaSchema);    // Creo el model esquema per a poder-lo