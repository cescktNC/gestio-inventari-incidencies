var mongoose = require("mongoose"); // Importar el mòdul 'mongoose'

var Schema = mongoose.Schema; // Diem que utilitzarem esquemes per a les collecions de MongoDB

var TicketSchema = new Schema({ // Esquema per al model 'ticket'
    numero: {type: Number},
    codiSessio: {type: String},
    idUsuari: { type: Schema.ObjectId , ref: "Usuari"},
    idReservaCadira: { type: Schema.ObjectId, ref: "ReservaCadira"}
});

// Export model.
module.exports = mongoose.model("Ticket", TicketSchema);