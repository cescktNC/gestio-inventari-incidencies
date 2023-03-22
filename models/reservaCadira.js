var mongoose = require("mongoose"); // Importar el mòdul 'mongoose'

var Schema = mongoose.Schema; // Diem que utilitzarem esquemes per a les collecions de MongoDB

var ReservaCadiraSchema = new Schema({ // Esquema per al model 'reservaCadira'
    idSessio: { type: Schema.ObjectId , ref: "Sessio"},
    idCadira: { type: Schema.ObjectId, ref: "Cadira"}
});

// Export model.
module.exports = mongoose.model("ReservaCadira", ReservaCadiraSchema);