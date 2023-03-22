var mongoose = require("mongoose"); // Diem que utilitzem el paquet 'mongoose'

var Schema = mongoose.Schema; // Diem que utilitzarem esquemes per a les collecions de MongoDB

var CadiraSchema = new Schema({ // Esquema per al model 'Cadira'
    fila: {type: Number, required: true},
    numero: {type: Number, required: true},
});


// Export model.
module.exports = mongoose.model("Cadira", CadiraSchema);    // Creo el model esquema per a poder-lo