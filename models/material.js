// Paquet 'mongoose'
var mongoose = require("mongoose");

// Utilitzem esquemes per a les col·lecions de MongoDB
var Schema = mongoose.Schema;

// Es crea un nou esquema per a la col·lecio de MongoDB
var MaterialSchema = new Schema({
    codi: {type: Integer, required: true},
    nom: { type: String, required: true },
    descripcio: { type: String },
    preuCompra: { type: Double },
    anyCompra: { type: Date },
    fotografia: { type: String },
    codiCategoria: [{ type: Schema.ObjectId, ref: "Categoria" }],
});

// Es creo i s'exporta el model
module.exports = mongoose.model("Material", MaterialSchema);