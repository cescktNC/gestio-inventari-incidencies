var mongoose = require("mongoose"); // Diem que utilitzem el paquet 'mongoose'

var Schema = mongoose.Schema; // Diem que utilitzarem esquemes per a les collecions de MongoDB

const tokenSchema = new Schema({
  token: { type: String, required: true },
  idUsuari: { type: Schema.ObjectId , ref: 'Usuari', required: true },
});

module.exports = mongoose.model('Token', tokenSchema);
