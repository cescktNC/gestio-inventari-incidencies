var mongoose = require("mongoose"); // Diem que utilitzem el paquet 'mongoose'

var Schema = mongoose.Schema; // Diem que utilitzarem esquemes per a les collecions de MongoDB

var CadiraSchema = new Schema({ // Diem que creem un nou esquema per a les collecions de MongoDB
    
    numeroCadira: {type: Number, required: true},
    codiSessio: { type: Schema.ObjectId, ref: "Sessio"},

});


// Export model.
module.exports = mongoose.model("Cadira", CadiraSchema);    // Creo el model esquema per a poder-lo