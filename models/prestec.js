var mongoose = require("mongoose"); // Diem que utilitzem el paquet 'mongoose'

var Schema = mongoose.Schema; // Diem que utilitzarem esquemes per a les collecions de MongoDB

var PrestecSchema = new Schema({ // Diem que creem un nou esquema per a les collecions de MongoDB
    
    codi :{ type: String, required: true },
    dataInici: { type: Date, required: true},
    dataRetorn: { type: Date, required: true},
    codiExemplar : [{ type: Schema.ObjectId, ref: "Exemplar" }],
    dniUsuari: [{ type: Schema.ObjectId, ref: "Usuari"}],

});

PrestecSchema.virtual('formatarDataInici')
.get(function(){
  // el valor devuelto será un string en formato 'dd-mm-yyyy'
  return this.dataInici.toISOString().substring(0,10).split("-").reverse().join("-");
});

PrestecSchema.virtual('formatarDataRetorn')
.get(function(){
  // el valor devuelto será un string en formato 'dd-mm-yyyy'
  return this.dataRetorn.toISOString().substring(0,10).split("-").reverse().join("-");
});

PrestecSchema.virtual('updateDate')
.get(function(){
  // el valor devuelto será un string en formato 'dd-mm-yyyy'
  return this.dataRetorn.toISOString().substring(0,10);
});


// Export model.
module.exports = mongoose.model("Prestec", PrestecSchema);    // Creo el model esquema per a poder-lo