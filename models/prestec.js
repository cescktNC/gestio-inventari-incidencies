var mongoose = require("mongoose"); // Diem que utilitzem el paquet 'mongoose'

var Schema = mongoose.Schema; // Diem que utilitzarem esquemes per a les collecions de MongoDB

var PrestecSchema = new Schema({ // Diem que creem un nou esquema per a les collecions de MongoDB
    
    codi :{ type: Number, required: true },
    dataInici: { type: Date, required: true},
    dataRetorn: { type: Date, required: true},
    codiExemplar : [{ type: Schema.ObjectId, ref: "Exemplar" }],
    dniUsuari: [{ type: Schema.ObjectId, ref: "Usuari"}],
    

});


// Export model.
module.exports = mongoose.model("Prestec", PrestecSchema);    // Creo el model esquema per a poder-lo