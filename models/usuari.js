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

UsuariSchema.methods.checkLetterDNI = function(dni) {
    let letters = ['T','R','W','A','G','M','Y','F','P','D','X','B','N','J','Z','S','Q','V','H','L','C','K','E'];
    dni = dni.replaceAll(' ', ''); // Eliminar espais en blanc
    let lletra = dni.substring(dni.length - 1); // S'extreu la lletra
    dni = dni.substring(0, dni.length - 1); // S'extreu la numeració
    let index = dni % 23;

    if (letters[index] == lletra) {
        return true;
    } else return false;
};

// Es creo i s'exporta el model
module.exports = mongoose.model("Usuari", UsuariSchema);