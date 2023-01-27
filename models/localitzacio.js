var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var LocalitzacioSchema = new Schema({
    codi: { type: String, required: true, },
    nom: { type: String, required: true, },
    codiPlanta: { type: Schema.ObjectId, ref: "Planta" },
    especial: { type: Boolean,  required: true,},
});


// Export model.
module.exports = mongoose.model("Localitzacio", LocalitzacioSchema);
