var mongoose = require("mongoose"); // Diem que utilitzem el paquet 'mongoose'

var Schema = mongoose.Schema; // Diem que utilitzarem esquemes per a les collecions de MongoDB

var ExemplarSchema = new Schema({ // Diem que creem un nou esquema per a les collecions de MongoDB
    codi:{ type: String, required: true, unique: true },
    demarca: {type: Boolean },
    qr: {type: String},
    codiMaterial: { type: Schema.ObjectId, ref: "Material" },
    codiLocalitzacio : { type: Schema.ObjectId, ref: "Localitzacio" },
    fotografiaMaterial : {type: Schema.ObjectId, ref: "Fotografia"}
});


// Export model.
module.exports = mongoose.model("Exemplar", ExemplarSchema);    // Creo el model esquema per a poder-lo