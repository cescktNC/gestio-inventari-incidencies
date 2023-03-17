var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var IncidenciaSchema = new Schema({

    codi: { type: String, required: true, unique: true},
    data:{ type: Date},
    tipologia : {
      type: String,
      enum: ['Mal ús','Desgast','Obsolet','Avariat','Altres',' '],
    },
    estat: { 
        type: String, 
        enum : ['Notificada','En tràmit', 'En execució', 'Resolta', 'Desestimada', 'Anul·lada'],
        default: 'Notificada'
    },
    proposta: { type: String },
    prioritat: { 
        type: String, 
        enum : ['Molt Alta','Alta', 'Mitjana', 'Baixa', 'Molt baixa'],
        default: 'Mitjana'
    },
    descripcio: { type: String },
    ubicacio: { type: String },
    codiExemplar: { type: Schema.ObjectId, ref: "Exemplar" },
    codiLocalitzacio: { type: Schema.ObjectId, ref: "Localitzacio" }

});

IncidenciaSchema.virtual('formatarDate')
  .get(function(){
    // el valor devuelto será un string en formato 'dd-mm-yyyy'
    return this.data.toISOString().substring(0,10).split("-").reverse().join("-");
  });


// Export model.
module.exports = mongoose.model("Incidencia", IncidenciaSchema);