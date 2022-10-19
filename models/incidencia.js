var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var IncidenciaSchema = new Schema({
    codi: { type: Number, required: true, },
    seguiment: { type: String },
    estat: { type: String },
    data: { type: Date },
    proposta: { type: String },
    prioritat: { type: String },
    descripcio: { type: String },
    ubicacio: { type: String },
    codiExemplar: [{ type: Schema.ObjectId, ref: "Exemplar" }],
    codiCentre: [{ type: Schema.ObjectId, ref: "Centre" }],

});


// Export model.
module.exports = mongoose.model("Incidencia", IncidenciaSchema);