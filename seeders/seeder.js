/* ****************************************************************************** */
/* Aquest arxiu serveix per a importar dades d'un arxiu JSON a la base de dades   */
/* ****************************************************************************** */

// Importar el mòdul 'fs' que s'inclou a Node (No fa falta instalar-lo)
const fs = require('fs');

var url = require('url');

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

// Quan s'executa la comanda per a carregar el seeder s'ha d'especificar l'argument
// que decidirà si importar dades o eliminar-les, i de quin model ha de ser.
// Per exemple, les dues següents comandes importen i eliminen usuaris de les taules
// de MongoDB, respectivament:
//      node seeder -u -i
//      node seeder -u -d
if (process.argv[2] === '-u') {
    const Usuari = require('../models/usuari');
    const bcrypt = require('bcrypt');

    if (process.argv[3] === '-i') {
        const dades = JSON.parse(
            fs.readFileSync(`usuaris.json`, "utf-8")
        );

        let count = 0;
        dades.forEach(async element => {
            const salt = await bcrypt.genSalt(10);
            element.password = await bcrypt.hash(element.password, salt);
            count++;
            if (count == dades.length) return importData(Usuari, dades);
        });
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

        dades.forEach(async element => {
            let categoria = await Categoria.findById(element.codiCategoria);
            element.codi += '/' + categoria.codi;

            count++;
            if (count == dades.length) return importData(Subcategoria, dades);
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

        dades.forEach(async element => {
            let subcategoria = await Subcategoria.findById(element.codiSubCategoria);
            element.codi += '-' + subcategoria.codi;
            count++;
            if (count == dades.length) return importData(Material, dades);
        });

    } else if (process.argv[3] === '-d') {
        deleteData(Material);
    }
} else if (process.argv[2] === '-e') {
    const Exemplar = require('../models/exemplar');
    const Material = require('../models/material');
    const Localitzacio = require('../models/localitzacio');
    var QRCode = require('qrcode');
    var url = require('url');

    if (process.argv[3] === '-i') {
        let dades = JSON.parse(
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
            if (count == dades.length) return importData(Exemplar, dades);
        });

    } else if (process.argv[3] === '-d') {
        deleteData(Exemplar);
    }
} else if (process.argv[2] === '-p') {
    const Prestec = require('../models/prestec');
    const Exemplar = require('../models/exemplar');
    const Usuari = require('../models/usuari');

    if (process.argv[3] === '-i') {
        let dades = JSON.parse(
            fs.readFileSync(`prestec.json`, "utf-8")
        );

        let count = 0;

        dades.forEach(async element => {

            let exemplar = await Exemplar.find({ codi: element.codiExemplar });
            let usuari = await Usuari.find({ dni: element.dniUsuari });

            element.codiExemplar = exemplar[0].id;
            element.dniUsuari = usuari[0].id;

            count++;
            if (count == dades.length) return importData(Prestec, dades);
        });

    } else if (process.argv[3] === '-d') {
        deleteData(Prestec);
    }
} else if (process.argv[2] === '-ct') {
    const Centre = require('../models/centre');

    if (process.argv[3] === '-i') {
        let dades = JSON.parse(
            fs.readFileSync(`centre.json`, "utf-8")
        );
        importData(Centre, dades);

    } else if (process.argv[3] === '-d') {
        deleteData(Centre);
    }
} else if (process.argv[2] === '-pt') {
    const Planta = require('../models/planta');
    const Centre = require('../models/centre');

    if (process.argv[3] === '-i') {
        let dades = JSON.parse(
            fs.readFileSync(`planta.json`, "utf-8")
        );

        let count = 0;

        dades.forEach(async element => {

            let centre = await Centre.find({ nom: element.nomCentre });
            element.codi += '/' + centre[0].codi
            element.codiCentre = centre[0].id;

            count++;
            if (count == dades.length) return importData(Planta, dades);
        });

    } else if (process.argv[3] === '-d') {
        deleteData(Planta);
    }
} else if (process.argv[2] === '-l') {
    const Planta = require('../models/planta');
    const Localitzacio = require('../models/localitzacio');

    if (process.argv[3] === '-i') {
        let dades = JSON.parse(
            fs.readFileSync(`localitzacio.json`, "utf-8")
        );

        let count = 0;

        dades.forEach(async element => {

            let planta = await Planta.find({ nom: element.nomPlanta });
            element.codi += '/' + planta[0].codi
            element.codiPlanta = planta[0].id;

            count++;
            if (count == dades.length) return importData(Localitzacio, dades);
        });

    } else if (process.argv[3] === '-d') {
        deleteData(Localitzacio);
    }
} else {
    console.log('Primera opció incorrecta. Has de posar:\n\
        "-u" per a importar usuaris\n\
        "-c" per a importar categories\n\
        "-sc" per a importar subcategories\n\
        "-m" per a importar materials\n\
        "-e" per a importar exemplars\n\
        "-p" per a importar préstecs\n\
        "-ct" per a importar centres\n\
        "-pt" per a importar plantas');

    process.exit();
}
