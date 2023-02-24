/* ****************************************************************************** */
/* Aquest arxiu serveix per a importar dades d'un arxiu JSON a la base de dades   */
/* ****************************************************************************** */

// Importar el mòdul 'fs' que s'inclou a Node (No fa falta instalar-lo)
const fs = require('fs');

var url = require('url');

const Usuari = require('../models/usuari');
const Categoria = require('../models/categoria');
const bcrypt = require('bcrypt');
var dades,count;

// Importar el mòdul 'dotenv' per a insertar el fitxer '.env' amb totes les variables
var dotenv = require('dotenv');
dotenv.config({ path: "../.env" }); // S'especifica on està el fitxer '.env'
dotenv.config({ path: "../.env" }); // S'especifica on està el fitxer '.env'

// Importar el mòdul 'mongoose' i configurar la connexió a la base de dades de MongoDB
var mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Per a importar les dades del fitxer JSON a la base de dades de MongoDB
const importData = async (model, dades) => {
    try {
        await model.create(dades);
        console.log("Dades importades correctament...");
        process.exit();
    } catch (error) {
        console.error(error);
    }
};

// Per a esborrar totes les dades d'un model
const deleteData = async (model) => {
    try {
        await model.deleteMany();
        console.log("Dades eliminades correctament...");
        process.exit();
    } catch (error) {
        console.error(error);
    }
};

// Eliminació e importació de usuaris

deleteData(Usuari);
deleteData(Categoria);

dades = JSON.parse(
    fs.readFileSync(`usuaris.json`, "utf-8")
);

count = 0;
dades.forEach(async element => {
    const salt = await bcrypt.genSalt(10);
    element.password = await bcrypt.hash(element.password, salt);
    count++;
    if (count == dades.length) return importData(Usuari, dades);
});

dades = JSON.parse(
    fs.readFileSync(`categories.json`, "utf-8")
);
importData(Categoria, dades);



