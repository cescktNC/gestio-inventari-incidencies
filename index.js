var express = require('express');
var path = require('path');
var dotenv = require('dotenv'); // Per a insertar el fitxer '.env' amb totes les variables (**)

var indexRouter = require('./routes/indexRouter');
var categoriesRouter = require('./routes/categoriesRouter');
var subcategoriesRouter = require('./routes/subcategoriesRouter');
var materialsRouter = require('./routes/materialsRouter');
var usuarisRouter = require('./routes/usuarisRouter');
var exemplarRouter = require('./routes/exemplarRouter');
var localitzacioRouter = require('./routes/localitzacioRouter');
var centreRouter = require('./routes/centreRouter');
var sessioRouter = require('./routes/sessioRouter');
var reservaRouter = require('./routes/reservaRouter');
var cadiraRouter = require('./routes/cadiraRouter');
var incidenciaRouter = require('./routes/incidenciesRouter');

var app = express();

dotenv.config();  // Per a poder utilitzar les variables del fitxer '.env' (**)

const port = process.env.PORT || 8000;  // Ja es pot accedir a les variables de la següent manera 
                                        //'process.env.nom_variable' (**)

// Importar el mòdul 'mongoose' i configurar la connexió a la base de dades de MongoDB
var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

//mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + '/public')));

app.get('/', function (req, res) {
  res.render('home');
});


const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Configuració del sistema de rutes.
app.use('/', indexRouter);
app.use('/categories', categoriesRouter);
app.use('/subcategories', subcategoriesRouter);
app.use('/materials', materialsRouter);
app.use('/usuaris', usuarisRouter);
app.use('/exemplar', exemplarRouter);
app.use('/localitzacio', localitzacioRouter);
app.use('/centre', centreRouter);
app.use('/sessio', sessioRouter);
app.use('/reserva', reservaRouter);
app.use('/cadira', cadiraRouter);
app.use('/incidencies', incidenciaRouter);

module.exports = app;