var express = require('express');

var app = express();

var DuracionCAP = require('../models/puntajes/horasCapacitacion');
var NotaCapacitacion = require('../models/puntajes/capacitacionNota')
var CapNT = require('../models/puntajes/capacitacionNivelTecnico');
// ==============================================
//  Obtener Puntaje duración Capacitación
// ==============================================
app.get('/duracion/:duracion', (req, res) => {
    var duracion = req.params.duracion;

    DuracionCAP.find()
        .exec((err, obj) => {
            for (let i = 0; i < obj.length; i++) {
                if (duracion > 80) {
                    return res.status(200).json({
                        ok: true,
                        obj: 100
                    });
                }
                if (duracion <= obj[i].max && duracion >= obj[i].min) {
                    return res.status(200).json({
                        ok: true,
                        obj: obj[i].puntaje
                    });
                }
            }
        })
})

app.get('/nota/:nota', (req, res) => {
    var nota = req.params.nota;

    NotaCapacitacion.find()
        .exec((err, obj) => {
            for (let i = 0; i < obj.length; i++) {
                if (nota <= obj[i].aprobacion_maxima && nota >= obj[i].aprobacion_minima) {
                    return res.status(200).json({
                        ok: true,
                        obj: obj[i].factor
                    });
                }
            }
        })
})

app.get('/nivel-tecnico/:nivel', (req, res) => {
    var nivel = req.params.nivel;
    CapNT.find()
        .exec((err, obj) => {
            for (let i = 0; i < obj.length; i++) {
                if (obj[i].nivel_tecnico === nivel) {
                    return res.status(200).json({
                        ok: true,
                        obj: obj[i].factor
                    });
                }
            }
        })
})

module.exports = app;