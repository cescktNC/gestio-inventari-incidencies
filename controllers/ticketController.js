var Ticket = require("../models/ticket");
var ReservaCadira = require("../models/reservaCadira");
var Usuari = require('../models/usuari');
var Sessio = require("../models/sessio");
var Reserva = require("../models/reserva");
var Cadira = require("../models/cadira");

class ticketController {

    static async list(req, res, next) {

        let sessio = await Sessio.findById(req.params.idSessio);

        let ticketsDuplicats = await Ticket.find({ codiSessio: sessio.codi }).populate('idUsuari');

        let ticketsNoDuplicats = ticketsDuplicats.reduce((ticketsGuardats, ticket) => {
            const index = ticketsGuardats.findIndex(obj => obj.numero === ticket.numero);
            if (index === -1) {
                ticketsGuardats.push(ticket);
            }
            return ticketsGuardats;
        }, []);

        res.render('ticket/list', { tickets: ticketsNoDuplicats });

    }

    static async show(req, res, next) {

        let ticket = await Ticket.findById(req.params.idTicket);
        let usuari = await Usuari.findById(ticket.idUsuari);
        let tickets = await Ticket.find({ numero: ticket.numero });

        var sessio, reserva, cadires = [];
        let count = 0;
        var sessioGuardada = false;
        tickets.forEach(async ticket => {
            let cadiraReservada = await ReservaCadira.findById(ticket.idReservaCadira)
            .populate('idCadira')
            .populate('idSessio');
            if (!sessioGuardada) { 
                sessio = await Sessio.findById(cadiraReservada.idSessio._id);
                reserva = await Reserva.findById(cadiraReservada.idSessio.codiReserva);
                sessioGuardada = true;
            }
            let cadira = await Cadira.findById(cadiraReservada.idCadira._id);
            cadires.push(cadira);
            count++;
            if (count == tickets.length) {
                // Ordeno les cadires reservades per fila i número
                cadires.sort((a, b) => {
                    if (a.fila < b.fila) {
                        return -1;
                    } else if (a.fila > b.fila) {
                        return 1;
                    } else {
                        if (a.numero < b.numero) {
                            return -1;
                        } else if (a.numero > b.numero) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                });
                res.render('ticket/show', { usuari: usuari, sessio: sessio, reserva: reserva, cadires: cadires });
            }
        });

    }

    static async create(res, usuariId, idSessio, cadiresReservades) {

        let tickets = [];
        let cadires = [];
        
        let usuari = await Usuari.findById(usuariId);
        let sessio = await Sessio.findById(idSessio);

        const dataActual = new Date();
        const numero = dataActual.toLocaleDateString('es-ES', { 
            day: '2-digit',  
            month: '2-digit',  
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        })
        .replace(/[/,: ]/g, '');// data actual en format "ddmmyyyhhmmss" per a utilitzar-ho com a número de ticket ;)

        let count = 0;
        cadiresReservades.forEach(async cadiraReservada => {
            try {
                let cadiraRes = await ReservaCadira.find({ idSessio: cadiraReservada.idSessio, idCadira: cadiraReservada.idCadira });
                
                let cadira = await Cadira.findById(cadiraRes[0].idCadira);
                
                var ticket = {
                    numero: numero,
                    codiSessio: sessio.codi,
                    idUsuari: usuari._id,
                    idReservaCadira: cadiraRes[0]._id
                };
                tickets.push(ticket);
                cadires.push(cadira);
                count++;

                if (count == cadiresReservades.length) {
                    Ticket.create(tickets, async function (error) {
                        if (error) { // Pendent d'esborrar les cadires que ja s'havien reservat!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                            res.render('/sessio', { error: error.message });
                        } else {
                            // Ordeno les cadires reservades per fila i número
                            cadires.sort((a, b) => {
                                if (a.fila < b.fila) {
                                    return -1;
                                } else if (a.fila > b.fila) {
                                    return 1;
                                } else {
                                    if (a.numero < b.numero) {
                                        return -1;
                                    } else if (a.numero > b.numero) {
                                        return 1;
                                    } else {
                                        return 0;
                                    }
                                }
                            });
                            let reserva = await Reserva.findById(sessio.codiReserva);
                            res.render('ticket/show', { usuari: usuari, sessio: sessio, reserva: reserva, cadires: cadires });
                        }
                    });
                }
            } catch (e) {
                res.send('Error!');
            }
        });
    }

}

module.exports = ticketController;