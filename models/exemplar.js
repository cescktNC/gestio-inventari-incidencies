var mongoose = require("mongoose"); // Diem que utilitzem el paquet 'mongoose'

var Schema = mongoose.Schema; // Diem que utilitzarem esquemes per a les collecions de MongoDB

var ExemplarSchema = new Schema({ // Diem que creem un nou esquema per a les collecions de MongoDB
    
    codi:{ type: Number, required: true },
    demarca: {type: Boolean },
    qr: {type: String, required: true},
    codiMaterial: [{ type: Schema.ObjectId, ref: "Material" }],
    codiLocalitzacio : [{ type: Schema.ObjectId, ref: "Localitzacio" }],

});


// Export model.
module.exports = mongoose.model("Exemplar", ExemplarSchema);    // Creo el model esquema per a poder-lo