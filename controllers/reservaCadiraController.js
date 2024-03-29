var Cadira = require("../models/cadira");
var Sessio = require("../models/sessio");
var ReservaCadira = require("../models/reservaCadira");
var TicketController = require('./ticketController');

class reservaCadiraController {

    static async list(req, res, next) {
        try {
            let list_cadiresReservades = await ReservaCadira.find({idSessio: req.params.id})
                .populate('idCadira');
            let cadiresReservadesProvisionalment = [];
            res.render('reservaCadira/list', { cadiresReservades: list_cadiresReservades, idSessio: req.params.id, cadiresReservadesProvisionalment: cadiresReservadesProvisionalment });
        }
        catch (e) {
            res.send('Error!');
        }
    }

    static async create(req, res) {
        
        let cadiresReservadesProvisionalment = JSON.parse(req.params.cadiresReservadesProvisionalment);
        let sessio = await Sessio.findById(req.params.id);
        let count = 0;
        cadiresReservadesProvisionalment.forEach(async cadiraReservadaProvisional => {
            try {
                let cadira = await Cadira.findById(cadiraReservadaProvisional.idCadira._id)
                cadiraReservadaProvisional.idSessio = sessio._id;
                cadiraReservadaProvisional.idCadira = cadira._id;
                count++;

                if (count == cadiresReservadesProvisionalment.length) {
                    ReservaCadira.create(cadiresReservadesProvisionalment, async function (error) {
                        if (error) {
                            let list_cadiresReservades = await ReservaCadira.find({idSessio: req.params.id}).populate('idCadira');

                            res.render('reservaCadira/list', { error: error.message, cadiresReservades: list_cadiresReservades, idSessio: req.params.id });
                        } else {
                            await TicketController.create(res, req.params.usuariId, req.params.id, cadiresReservadesProvisionalment);
                        }
                    });
                }

            } catch (e) {
                res.send('Error!!!!');
            }
        });

    }

    static async reservaProvisional(req, res) {
        let fila = req.params.cadira.substring(0,1);
        let numero = req.params.cadira.substring(1);
        let cadira = await Cadira.find({ fila: fila, numero: numero });

        let cadiraReservada = {
            idSessio: req.params.id,
            idCadira: cadira[0]
        }

        let cadiresReservadesProvisionalment = JSON.parse(req.params.cadiresReservadesProvisionalment);
        cadiresReservadesProvisionalment.push(cadiraReservada);
      
        let list_cadiresReservades = await ReservaCadira.find({idSessio: req.params.id}).populate('idCadira');
        res.render('reservaCadira/list', { cadiresReservades: list_cadiresReservades, idSessio: req.params.id, cadiresReservadesProvisionalment: cadiresReservadesProvisionalment });
    }

    static async eliminarReservaProvisional(req, res) {
        let fila = parseInt(req.params.cadira.substring(0,1));
        let numero = parseInt(req.params.cadira.substring(1));
        let cadiresReservadesProvisionalment = JSON.parse(req.params.cadiresReservadesProvisionalment);

        cadiresReservadesProvisionalment = cadiresReservadesProvisionalment.filter(cadira => 
            cadira.idCadira.fila !== fila || (cadira.idCadira.fila === fila && cadira.idCadira.numero !== numero));

        let list_cadiresReservades = await ReservaCadira.find({idSessio: req.params.id}).populate('idCadira');


        res.render('reservaCadira/list', { cadiresReservades: list_cadiresReservades, idSessio: req.params.id, cadiresReservadesProvisionalment: cadiresReservadesProvisionalment });
    }

    static async delete(req, res, next) {

        try {
            var cadiraReservada = await ReservaCadira.findById(req.params.id);
        } catch (e) {
            res.send('Error!');
        }

        try {
            ReservaCadira.findByIdAndRemove(req.params.id, async function (error) {
                if (error) {
                    res.redirect('reservaCadira/list');
                } else {
                  
                    var list_cadiresReservades = await ReservaCadira.find({idSessio: cadiraReservada.idSessio}).populate('idCadira');

                    res.render('reservaCadira/list', { cadiresReservades: list_cadiresReservades, idSessio: req.params.id });
                }
            });
        } catch (e) {
            res.send('Error!');
        }

    }

    //API

    static async APIlist(req, res, next) {
        try {
            let list_cadiresReservades = await ReservaCadira.find({idSessio: req.params.id})
                .populate('idCadira');
            let cadiresReservadesProvisionalment = [];
            res.status(200).json({ cadiresReservades: list_cadiresReservades, cadiresReservadesProvisionalment: cadiresReservadesProvisionalment });
        }
        catch (e) {
            res.status(400).json({error: 'Error!'});
        }
    };

    static async APIcreate(req, res) {
        
        let cadiresReservadesProvisionalment = JSON.parse(req.params.cadiresReservadesProvisionalment);
        let sessio = await Sessio.findById(req.params.id);
        let count = 0;
        cadiresReservadesProvisionalment.forEach(async cadiraReservadaProvisional => {
            try {
                let cadira = await Cadira.findById(cadiraReservadaProvisional.idCadira._id)
                cadiraReservadaProvisional.idSessio = sessio._id;
                cadiraReservadaProvisional.idCadira = cadira._id;
                count++;

                if (count == cadiresReservadesProvisionalment.length) {
                    ReservaCadira.create(cadiresReservadesProvisionalment, async function (error) {
                        if (error) {
                            // let list_cadiresReservades = await ReservaCadira.find({idSessio: req.params.id}).populate('idCadira');
                            res.status(400).json({ error: error.message});
                        } else {
                            await TicketController.create(res, req.params.usuariId, req.params.id, cadiresReservadesProvisionalment);
                            res.status(200).json({ok: true});
                        }
                    });
                }

            } catch (e) {
                res.status(400).json({ error:'Error!!!!'});
            }
        });
    };

    static async APIreservaProvisional(req, res) {
        let fila = req.params.cadira.substring(0,1);
        let numero = req.params.cadira.substring(1);
        let cadira = await Cadira.find({ fila: fila, numero: numero });

        let cadiraReservada = {
            idSessio: req.params.id,
            idCadira: cadira[0]
        }

        let cadiresReservadesProvisionalment = JSON.parse(req.params.cadiresReservadesProvisionalment);
        cadiresReservadesProvisionalment.push(cadiraReservada);

        let list_cadiresReservades = await ReservaCadira.find({idSessio: req.params.id}).populate('idCadira');
        
        res.status(200).json({ cadiresReservades: list_cadiresReservades, cadiresReservadesProvisionalment: cadiresReservadesProvisionalment });
    };

    static async APieliminarReservaProvisional(req, res) {
        let fila = parseInt(req.params.cadira.substring(0,1));
        let numero = parseInt(req.params.cadira.substring(1));
        let cadiresReservadesProvisionalment = JSON.parse(req.params.cadiresReservadesProvisionalment);

        cadiresReservadesProvisionalment = cadiresReservadesProvisionalment.filter(cadira => 
            cadira.idCadira.fila !== fila || (cadira.idCadira.fila === fila && cadira.idCadira.numero !== numero));

        let list_cadiresReservades = await ReservaCadira.find({idSessio: req.params.id}).populate('idCadira');

        res.status(200).json({ cadiresReservades: list_cadiresReservades, cadiresReservadesProvisionalment: cadiresReservadesProvisionalment });
    };

    static async APIdelete(req, res, next) {
        try {
            var cadiraReservada = await ReservaCadira.findById(req.params.id);
        } catch (e) {
            res.status(400).json({error: 'Error!'});
        }

        try {
            ReservaCadira.findByIdAndRemove(req.params.id, async function (error) {
                if (error) {
                    res.status(400).json({error: error.message});
                } else {
                    var list_cadiresReservades = await ReservaCadira.find({idSessio: cadiraReservada.idSessio}).populate('idCadira');
                    res.status(200).json({ cadiresReservades: list_cadiresReservades});
                }
            });
        } catch (e) {
            res.status(400).json({error: 'Error!'});
        }

    };

}

module.exports = reservaCadiraController;