const fs = require('fs');
var mongoose = require('mongoose');
var dotenv = require('dotenv');

dotenv.config({ path:"../.env" });
const Usuari = require('../models/usuari');

var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_URI;

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

const usuaris = JSON.parse(
    fs.readFileSync(`usuaris.json`, "utf-8")
);

const importData = async () => {
    try {
        await Usuari.create(usuaris);
        console.log("Usuaris importats correctament...");
        process.exit();
    } catch (error) {
        console.error(error);
    }
};

const deleteData = async () => {
    try {
        await Usuari.deleteMany();
        console.log("Usuaris eliminats correctament...");
        process.exit();
    } catch (error) {
        console.error(error);
    }
};

if (process.argv[2] === '-u') {
    if (process.argv[3] === '-i') importData();
    else if (process.argv[3] === '-d') deleteData();
} else console.log('NO');