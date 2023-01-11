var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CentreSchema = new Schema({
    codi: { type: String, required: true, unique: true },
    nom: { type: String, required: true, },
});


// Export model.
module.exports = mongoose.model("Centre", CentreSchema);