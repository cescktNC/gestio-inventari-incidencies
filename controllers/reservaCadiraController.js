var Cadira = require("../models/cadira");
var Sessio = require("../models/sessio");
var ReservaCadira = require("../models/reservaCadira");

class reservaCadiraController {

    static async list(req, res, next) {
        try {
            let list_cadiresReservades = await ReservaCadira.find({idSessio: req.params.id})
                .populate('idCadira');
            res.render('reservaCadira/list', { cadiresReservades: list_cadiresReservades });
        }
        catch (e) {
            res.send('Error!');
        }
    }

    static async create(req, res) {
        try {
            
            let fila = req.params.cadira.substring(0,1);
            let numero = req.params.cadira.substring(1);
            let cadira = await Cadira.find({ fila: fila, numero: numero });
            
            cadiraReservada = {
                idSessio: req.params.id,
                idCadira: cadira[0]._id
            }
            
            ReservaCadira.create(cadiraReservada, async function (error, newSessio) {
                var list_cadiresReservades = await ReservaCadira.find({idSessio: cadiraReservada.idSessio})
                    .populate('idCadira');
                if (error) {
                  res.render('reservaCadira/list', { error: error.message, cadiresReservades: list_cadiresReservades });
                } else {
                    res.render('reservaCadira/list', { cadiresReservades: list_cadiresReservades });
                }
            });
        }
        catch (e) {
            res.send('Error!');
        }
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
                    var list_cadiresReservades = await ReservaCadira.find({idSessio: cadiraReservada.idSessio})
                        .populate('idCadira');
                    res.render('reservaCadira/list', { cadiresReservades: list_cadiresReservades });
                }
            });
        } catch (e) {
            res.send('Error!');
        }

    }

}

module.exports = reservaCadiraController;