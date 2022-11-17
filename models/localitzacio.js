var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var LocalitzacioSchema = new Schema({
    codi: { type: Number, required: true, },
    nom: { type: String, required: true, },
    codiCentre: [{ type: Schema.ObjectId, ref: "Centre" }],
    especial: { type: Boolean,  required: true,},
});


// Export model.
module.exports = mongoose.model("Localitzacio", LocalitzacioSchema);