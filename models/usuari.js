// Paquet 'mongoose'
var mongoose = require("mongoose");

// Utilitzem esquemes per a les col·lecions de MongoDB
var Schema = mongoose.Schema;

// Es crea un nou esquema per a la col·lecio de MongoDB
var UsuariSchema = new Schema({
    nom: { type: String, required: true },
    cognoms: { type: String },
    dni: { type: String },
    carrec: {
        type: String,
        enum : ['Director','Professor','Alumne','Conserge','Administrador','Manteniment','Encarregat Inventari'],
        default: 'Professor'
    },
    email: {type: String, required: true },
    password: { type: String, required: true },
});

// Es creo i s'exporta el model
module.exports = mongoose.model("Usuari", UsuariSchema);