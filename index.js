var express = require('express');
var path = require('path');
var dotenv = require('dotenv'); // Per a insertar el fitxer '.env' amb totes les variables (**)
var session = require('express-session');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));  //Preguntar a Ramón


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
var plantaRouter = require('./routes/plantaRouter');
var prestecRouter = require('./routes/prestecRouter');
var incidenciaRouter = require('./routes/incidenciesRouter');

var app = express();

dotenv.config();  // Per a poder utilitzar les variables del fitxer '.env' (**)

const port = process.env.PORT || 8000;  // Ja es pot accedir a les variables de la següent manera 
//'process.env.nom_variable' (**)

// Importar el mòdul 'mongoose' i configurar la connexió a la base de dades de MongoDB
var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Configuració de la sessió
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  name: 'usuari', // la sessió funciona a tavés d'una cookie, en aquest cas es dirà 'M12'
  saveUninitialized: true,
  cookie: { maxAge: 1000*60*60 }, // ms de durada de la cookie
}));

//mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + '/public')));

// Guardar dades d'usuari a la variable local per a poder accedir des de les vistes
app.use(function (req, res, next) {
  if(req.session.data) {
    res.locals.userId = req.session.data.userId;
    res.locals.fullname = req.session.data.fullname;
    res.locals.role = req.session.data.role;
  }
  next(); 
});

app.get('/', function (req, res) {
  res.render('home');
});

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use('/planta', plantaRouter);
app.use('/home', indexRouter);
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
app.use('/prestec', prestecRouter);

// Per a poder utilitzar el sistema de rutes
//app.use('/', indexRouter);              // Qualssevol ruta amb la barra '/' anirà al fitxer 'indexRouter'
//app.use('/genres', genresRouter);       // Qualssevol ruta amb la barra '/genres' anirà al fitxer 'genresRouter'

module.exports = app;