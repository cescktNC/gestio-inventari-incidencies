var mongoose = require("mongoose"); // Diem que utilitzem el paquet 'mongoose'

var Schema = mongoose.Schema; // Diem que utilitzarem esquemes per a les collecions de MongoDB

const tokenSchema = new Schema({
  token: { type: String, required: true },
  idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  expira: { type: Date, required: true }
});

module.exports = mongoose.model('Token', tokenSchema);
