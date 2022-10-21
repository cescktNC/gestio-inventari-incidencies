var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CategoriaSchema = new Schema({
    codi: { type: Number, required: true, unique: true},
    nom: { type: String, required: true, },
});


// Export model.
module.exports = mongoose.model("Categoria", CategoriaSchema);