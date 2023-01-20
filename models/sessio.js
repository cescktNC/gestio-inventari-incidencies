var mongoose = require("mongoose"); // Diem que utilitzem el paquet 'mongoose'

var Schema = mongoose.Schema; // Diem que utilitzarem esquemes per a les collecions de MongoDB

var SessioSchema = new Schema({ // Diem que creem un nou esquema per a les collecions de MongoDB
    
    codi :{ type: String, required: true },
    nom: { type: String, required: true},
    codiReserva: { type: Schema.ObjectId, ref: "Reserva"},

});


// Export model.
module.exports = mongoose.model("Sessio", SessioSchema);    // Creo el model esquema per a poder-lo