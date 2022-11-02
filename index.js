var express = require('express');
var path = require('path');
var dotenv = require('dotenv'); // Per a insertar el fitxer '.env' amb totes les variables (**)

var indexRouter = require('./routes/indexRouter');
var categoriesRouter = require('./routes/categoriesRouter');
var subcategoriasRouter = require('./routes/subcategoriasRouter');
var exemplarRouter = require('./routes/exemplarRouter');
var materialRouter = require('./routes/materialsRouter');
var localitzacioRouter = require('./routes/localitzacioRouter');
var centreRouter = require('./routes/centreRouter');
var sessioRouter = require('./routes/sessioRouter');
var reservaRouter = require('./routes/reservaRouter');
var cadiraRouter = require('./routes/cadiraRouter');

//var indexRouter = require('./routes/indexRouter');
//var genresRouter = require('./routes/genresRouter');

var app = express();

dotenv.config();  // Per a poder utilitzar les variables del fitxer '.env' (**)

const port = process.env.PORT || 8000;  // Ja es pot accedir a les variables de la següent manera 
//'process.env.nom_variable' (**)

// Set up mongoose connection
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

app.use('/home', indexRouter);
app.use('/categories', categoriesRouter);
app.use('/subcategorias', subcategoriasRouter);
app.use('/exemplar', exemplarRouter);
app.use('/materials', materialRouter);
app.use('/localitzacio', localitzacioRouter);
app.use('/centre', centreRouter);
app.use('/sessio', sessioRouter);
app.use('/reserva', reservaRouter);
app.use('/cadira', cadiraRouter);

// Per a poder utilitzar el sistema de rutes
//app.use('/', indexRouter);              // Qualssevol ruta amb la barra '/' anirà al fitxer 'indexRouter'
//app.use('/genres', genresRouter);       // Qualssevol ruta amb la barra '/genres' anirà al fitxer 'genresRouter'

module.exports = app;