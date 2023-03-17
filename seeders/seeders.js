/* ****************************************************************************** */
/* Aquest arxiu serveix per a importar dades d'un arxiu JSON a la base de dades   */
/* ****************************************************************************** */

// Importar el mòdul 'fs' que s'inclou a Node (No fa falta instalar-lo)
const fs = require('fs');

var dades;
var url = require('url');
var QRCode = require('qrcode');
const bcrypt = require('bcrypt');


const Usuari = require('../models/usuari');

const Centre = require('../models/centre');
const Planta = require('../models/planta');
const Localitzacio = require('../models/localitzacio');
const Categoria = require('../models/categoria');
const SubCategoria = require('../models/subcategoria');
const Material = require('../models/material');
const Exemplar = require('../models/exemplar');
const Prestec = require('../models/prestec');
const Incidencia = require('../models/incidencia');
const Comentari = require('../models/comentari');

// Importar el mòdul 'dotenv' per a insertar el fitxer '.env' amb totes les variables
var dotenv = require('dotenv');
dotenv.config({ path: "../.env" }); // S'especifica on està el fitxer '.env'
dotenv.config({ path: "../.env" }); // S'especifica on està el fitxer '.env'

// Importar el mòdul 'mongoose' i configurar la connexió a la base de dades de MongoDB
var mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const subcategoria = require('../models/subcategoria');
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Per a importar les dades del fitxer JSON a la base de dades de MongoDB 
const importData = async (model, dades) => {
    try {
        await model.create(dades);
        console.log("Dades importades correctament...");
    } catch (error) {
        console.error(error);
    }
};

// Per a esborrar totes les dades d'un model
const deleteData = async (model) => {
    try {
        await model.deleteMany();
        console.log("Dades eliminades correctament...");
        return;
    } catch (error) {
        console.error(error);
    }
};

// Eliminació
async function eliminar() {
    await deleteData(Usuari);
    await deleteData(Centre);
    await deleteData(Planta);
    await deleteData(Localitzacio);
    await deleteData(Categoria);
    await deleteData(SubCategoria);
    await deleteData(Material);
    await deleteData(Exemplar);
    await deleteData(Prestec);
    await deleteData(Incidencia);
    await deleteData(Comentari);
}

async function usuaris() {
    //Usuaris
    dades = JSON.parse(
        fs.readFileSync(`usuaris.json`, "utf-8")
    );

    let count = 0;

    return dades.forEach(async element => {
        const salt = await bcrypt.genSalt(10);
        element.password = await bcrypt.hash(element.password, salt);
        count++;
        if (count == dades.length) {
            await importData(Usuari, dades);
            await centres();
        }
    });
}

async function centres() {
    //Centre
    dades = JSON.parse(
        fs.readFileSync(`centre.json`, "utf-8")
    );

    await importData(Centre, dades);
    await plantes();

}

async function plantes() {
    Planta
    dades = JSON.parse(
        fs.readFileSync(`planta.json`, "utf-8")
    );

    let count = 0;

    await dades.forEach(async element => {

        let centre = await Centre.find({ nom: element.nomCentre });
        element.codi += '/' + centre[0].codi;
        element.codiCentre = centre[0].id;
        count++;
        if (count == dades.length) {
            await importData(Planta, dades);
            await localitzacions();
        }
    });
}

async function localitzacions() {
    Localitzacio
    dades = JSON.parse(
        fs.readFileSync(`localitzacio.json`, "utf-8")
    );

    let count = 0;

    await dades.forEach(async element => {
        let planta = await Planta.find({ nom: element.nomPlanta });
        element.codi += '/' + planta[0].codi
        element.codiPlanta = planta[0].id;
        count++;
        if (count == dades.length) {
            await importData(Localitzacio, dades);
            await categories();
        }
    });
}

async function categories() {
    //Categories
    dades = JSON.parse(
        fs.readFileSync(`categories.json`, "utf-8")
    );

    await importData(Categoria, dades);
    await subCategories();

}

async function subCategories() {
    //subCategories
    dades = JSON.parse(
        fs.readFileSync(`subcategories.json`, "utf-8")
    );

    let count = 0;

    dades.forEach(async element => {
        let categoria = await Categoria.find({codi: element.codiCategoria});
        element.codi += '/' + categoria[0].codi;
        element.codiCategoria = categoria[0].id;
        count++;
        if (count == dades.length) {
            await importData(SubCategoria, dades);
            await materials();
        }
    });
};

async function materials() {
    //Material
    dades = JSON.parse(
        fs.readFileSync(`materials.json`, "utf-8")
    );

    let count = 0;

    dades.forEach(async element => {
        let subcategoria = await SubCategoria.find({ codi: element.codiSubCategoria});
        element.codi += '-' + subcategoria[0].codi;
        element.codiSubCategoria = subcategoria[0].id;
        count++;
        if (count == dades.length) {
            await importData(Material, dades);
            await exemplars();
        }
    });
}

async function exemplars() {
    //Exemplar
    dades = JSON.parse(
        fs.readFileSync(`exemplars.json`, "utf-8")
    );

    let count = 0;


    dades.forEach(async element => {

        let material = await Material.find({ nom: element.nomMaterial });
        let localitzacio = await Localitzacio.find({ nom: element.nomLocalitzacio });
        element._id = ObjectId();
        element.codi += '/' + material[0].codi + '-' + localitzacio[0].codi;

        element.codiMaterial = material[0].id;
        element.codiLocalitzacio = localitzacio[0].id;

        const exemplar_path = url.parse('http://localhost:5000/exemplar/show/' + element._id);
        // Genero el QR
        QRCode.toString(exemplar_path.href, {
            errorCorrectionLevel: 'H',
            type: 'svg'
        }, function (err, qr_svg) {
            if (err) throw err;
            element.qr = qr_svg;

        });
        count++;
        if (count == dades.length) {
            await importData(Exemplar, dades);
            await prestecs();
        }
    });
}

async function prestecs() {
    //Prestec
    dades = JSON.parse(
        fs.readFileSync(`prestec.json`, "utf-8")
    );

    let count = 0;

    dades.forEach(async element => {

        let exemplar = await Exemplar.find({ codi: element.codiExemplar });
        let usuari = await Usuari.find({ dni: element.dniUsuari });

        element.codiExemplar = exemplar[0].id;
        element.dniUsuari = usuari[0].id;
        count++;
        if (count == dades.length) {
            await importData(Prestec, dades);
            await incidencies();
        }
    });
}

async function incidencies() {
    //Incidencia
    dades = JSON.parse(
        fs.readFileSync(`incidencia.json`, "utf-8")
    );

    let count = 0;

    dades.forEach(async element => {

        let localitzacio = await Localitzacio.find({ nom: element.nomLocalitzacio });
        if (localitzacio.length != 0) element.codiLocalitzacio = localitzacio[0].id;
        let exemplar = await Exemplar.find({ codi: element.identificacioExemplar });
        if (exemplar.length != 0) element.codiExemplar = exemplar[0].id;
        count++;
        if (count == dades.length) {
            await importData(Incidencia, dades);
            await comentaris();
        }
    });
}

async function comentaris() {
    //Comentari
    dades = JSON.parse(
        fs.readFileSync(`comentari.json`, "utf-8")
    );

    let count = 0

    await dades.forEach(async element => {

        let incidencia = await Incidencia.find({ codi: element.codiIncidencia });
        let usuari = await Usuari.find({ dni: element.codiUsuari });
        element.codiIncidencia = incidencia[0].id;
        element.codiUsuari = usuari[0].id;
        count++;
        if (count == dades.length) {
            await importData(Comentari, dades);
            process.exit();
        }
    });
}

async function eliminacioICarregaDeDades() {
    await eliminar();
    await usuaris();
}

eliminacioICarregaDeDades();