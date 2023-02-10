/* ****************************************************************************** */
/* Aquest arxiu serveix per a importar dades d'un arxiu JSON a la base de dades   */
/* ****************************************************************************** */

// Importar el mòdul 'fs' que s'inclou a Node (No fa falta instalar-lo)
const fs = require('fs');

var url  = require('url');

// Importar el mòdul 'dotenv' per a insertar el fitxer '.env' amb totes les variables
var dotenv = require('dotenv');
dotenv.config({ path:"../.env" }); // S'especifica on està el fitxer '.env'

// Importar el mòdul 'mongoose' i configurar la connexió a la base de dades de MongoDB
var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

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

// Quan s'executa la comanda per a carregar el seeder s'ha d'especificar l'argument
// que decidirà si importar dades o eliminar-les, i de quin model ha de ser.
// Per exemple, les dues següents comandes importen i eliminen usuaris de les taules
// de MongoDB, respectivament:
//      node seeder -u -i
//      node seeder -u -d
if (process.argv[2] === '-u') {
    const Usuari = require('../models/usuari');
    if (process.argv[3] === '-i') {
        const dades = JSON.parse(
            fs.readFileSync(`usuaris.json`, "utf-8")
        );
        importData(Usuari, dades);
    } else if (process.argv[3] === '-d') {
        deleteData(Usuari);
    }
} else if (process.argv[2] === '-c') {
    const Categoria = require('../models/categoria');
    if (process.argv[3] === '-i') {
        const dades = JSON.parse(
            fs.readFileSync(`categories.json`, "utf-8")
        );
        importData(Categoria, dades);
    } else if (process.argv[3] === '-d') {
        deleteData(Categoria);
    }
} else if (process.argv[2] === '-sc') {
    const Subcategoria = require('../models/subcategoria');
    const Categoria = require('../models/categoria');
    if (process.argv[3] === '-i') {
        let dades = JSON.parse(
            fs.readFileSync(`subcategories.json`, "utf-8")
        );

        let count = 0;

        dades.forEach( async element => {
            let categoria = await Categoria.findById(element.codiCategoria);
            element.codi += '/' + categoria.codi;
           count++;
           if(count == dades.length) return importData(Subcategoria, dades);
        });

    } else if (process.argv[3] === '-d') {
        deleteData(Subcategoria);
    }
} else if (process.argv[2] === '-m') {
    const Subcategoria = require('../models/subcategoria');
    const Material = require('../models/material');
    if (process.argv[3] === '-i') {
        let dades = JSON.parse(
            fs.readFileSync(`materials.json`, "utf-8")
        );

        let count = 0;

        dades.forEach( async element => {
            let subcategoria = await Subcategoria.findById(element.codiSubCategoria);
            element.codi += '-' + subcategoria.codi;
            count++;
            if(count == dades.length) return importData(Material, dades);
        });

    } else if (process.argv[3] === '-d') {
        deleteData(Material);
    }
} else {
    console.log('Primera opció incorrecta. Has de posar:\n\
    "-u" per a importar usuaris\n\
    "-c" per a importar categories\n\
    "-sc" per a importar subcategories');
    process.exit();
}