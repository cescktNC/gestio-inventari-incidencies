// Paquet 'mongoose'
var mongoose = require("mongoose");

// Utilitzem esquemes per a les col·lecions de MongoDB
var Schema = mongoose.Schema;

// Es crea un nou esquema per a la col·lecio de MongoDB
var MaterialSchema = new Schema({
  codi: { type: String, required: true, unique: true },
  nom: { type: String, required: true },
  descripcio: { type: String },
  preuCompra: { type: Number },
  anyCompra: { type: Date },
  fotografia: { type: String },
  codiSubCategoria: { type: Schema.ObjectId, ref: "Subcategoria" },
});

// El schema.virtual són propietats del document que podeu obtenir i establir però que no es conserven a MongoDB.
MaterialSchema.virtual('formatarDate')
  .get(function () {
    // el valor returnat será un string en format 'dd-mm-yyyy'
    return this.anyCompra.toISOString().substring(0, 10).split("-").reverse().join("-");
  });

MaterialSchema.virtual('updateDate')
  .get(function () {
    // el valor returnat será un string en format 'dd-mm-yyyy'
    return this.anyCompra.toISOString().substring(0, 10);
  });

module.exports = mongoose.model("Material", MaterialSchema);