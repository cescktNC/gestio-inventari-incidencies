var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var IncidenciaSchema = new Schema({
<<<<<<< HEAD
    codi: { type: Number, required: true, },
    tipologia : {
      type: String,
      enum: ['Mal ús','Desgast','Obsolet','Avariat','Altres'],
    },
=======
    codi: { type: String, required: true, unique: true },
    seguiment: { type: String },
>>>>>>> 52e3853c0f9d398d974995ac5deecbcce2090f82
    estat: { 
        type: String, 
        enum : ['Notificada','En tràmit', 'En execució', 'Resolta', 'Desestimada', 'Anul·lada'],
        default: 'Notificada'
    },
    data: { type: Date },
    proposta: { type: String },
    prioritat: { 
        type: String, 
        enum : ['Molt Alta','Alta', 'Mitjana', 'Baixa', 'Molt baixa'],
        default: 'Mitjana'
    },
    descripcio: { type: String },
    ubicacio: { type: String },
    codiExemplar: [{ type: Schema.ObjectId, ref: "Exemplar" }],
    codiLocalitzacio: [{ type: Schema.ObjectId, ref: "Localitzacio" }],

});

IncidenciaSchema.virtual('formatarDate')
  .get(function(){
    // el valor devuelto será un string en formato 'dd-mm-yyyy'
    return this.data.toISOString().substring(0,10).split("-").reverse().join("-");
  });


// Export model.
module.exports = mongoose.model("Incidencia", IncidenciaSchema);