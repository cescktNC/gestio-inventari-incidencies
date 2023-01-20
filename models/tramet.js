var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var TrametSchema = new Schema({
    codiIncidencia: { type: Schema.ObjectId, ref: "Incidencia" },
    codiUsuari: { type: Schema.ObjectId, ref: "Usuari" },
    codiComentari: { type: Schema.ObjectId, ref: "Tramet" }
});

// Export model.
module.exports = mongoose.model("Tramet", TrametSchema);