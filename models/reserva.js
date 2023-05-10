var mongoose = require("mongoose"); // Diem que utilitzem el paquet 'mongoose'

var Schema = mongoose.Schema; // Diem que utilitzarem esquemes per a les collecions de MongoDB

var ReservaSchema = new Schema({ // Diem que creem un nou esquema per a les collecions de MongoDB
    
    codi: { type: Number, required: true },
<<<<<<< HEAD
    horaInici: { type: Date, required: true},
    horaFi: { type: Date, required: true},
=======
    // hora: { type: String, required: true},
    horaInici: { type: Date, required: true},
    horaFi: { type: Date, required: true},
    // data: { type: Date, required: true},
>>>>>>> 46734f3 (ticket, reserva cadires i modificacions varies)
    dniUsuari: { type: Schema.ObjectId , ref: "Usuari"},
    codiLocalitzacio: { type: Schema.ObjectId, ref: "Localitzacio"},

});

ReservaSchema.virtual('formatarDate')
    .get(function(){
    // el valor devuelto será un string en formato 'dd-mm-yyyy'
    return this.data.toISOString().substring(0,10).split("-").reverse().join("-");
});

// Export model.
module.exports = mongoose.model("Reserva", ReservaSchema);    // Creo el model esquema per a poder-lo