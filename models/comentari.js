var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ComentariSchema = new Schema({
    codiIncidencia: [{ type: Schema.ObjectId, ref: "Incidencia" }],
    codiUsuari: [{ type: Schema.ObjectId, ref: "Usuari" }],
    data: { type: Date },
    descripcio: { type: String, required: true }
});

ComentariSchema.virtual('formatarDate')
    .get(function () {
        return this.data.toISOString().substring(0, 10).split("-").reverse().join("-");
    });


// Export model.
module.exports = mongoose.model("Comenari", ComentariSchema);