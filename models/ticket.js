var mongoose = require("mongoose"); // Importar el mòdul 'mongoose'

var Schema = mongoose.Schema; // Diem que utilitzarem esquemes per a les collecions de MongoDB

var TicketSchema = new Schema({ // Esquema per al model 'ticket'
    numero: {type: Number, required: true, unique: true},
    codiSessio: {type: String, required: true},
    idUsuari: { type: Schema.ObjectId , ref: "Usuari", required: true},
    idReservaCadira: { type: Schema.ObjectId, ref: "ReservaCadira", required: true}
});

// Export model.
module.exports = mongoose.model("Ticket", TicketSchema);