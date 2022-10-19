var mongoose = require("mongoose"); // Diem que utilitzem el paquet 'mongoose'

var Schema = mongoose.Schema; // Diem que utilitzarem esquemes per a les collecions de MongoDB

var ReservaSchema = new Schema({ // Diem que creem un nou esquema per a les collecions de MongoDB
    
    codi :{ type: Number, required: true },
    hora: { type: String, required: true},
    data: { type: String, required: true},
    dniUsuari: [{ type: Schema.ObjectId , ref: "Usuari"}],
    codiLocalitzacio: [{ type: Schema.ObjectId, ref: "Localitzacio"}],

});


// Export model.
module.exports = mongoose.model("Reserva", ReservaSchema);    // Creo el model esquema per a poder-lo