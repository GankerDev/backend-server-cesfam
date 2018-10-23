var express = require('express');

var mdAutenticacion = require('../../middlewares/autenticacion');

var app = express();

var CapacitacionNota = require('../../models/puntajes/capacitacionNota');

// ==============================================
//  Obtener todos las notas de capacitaciones
// ==============================================

app.get('/', (req, res, next) => {

    CapacitacionNota.find({})
        .exec(
            (err, CapacitacionesNota) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando nota capacitacion',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    CapacitacionesNota: CapacitacionesNota
                });

            })
});

// ==============================================
//  Crear nueva capacitacion
// ==============================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var capacitacionNota = new CapacitacionNota({
        aprobacion_minima: body.aprobacion_minima,
        aprobacion_maxima: body.aprobacion_maxima,
        factor: body.factor,
        usuario: req.usuario._id
    });

    capacitacionNota.save((err, capacitacionNotaGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear nota capacitacion',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            capacitacionNota: capacitacionNotaGuardado,
            usuario: req.usuario._id
        });
    });

});

// ==============================================
//  Actualizar nota capacitacion
// ==============================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    CapacitacionNota.findById(id, (err, capacitacionNota) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La capacitacion con el id ' + id + ' no existe',
                errors: { message: 'No existe capacitacion con ese ID' }
            });
        }

        capacitacionNota.aprobacion_minima = body.aprobacion_minima;
        capacitacionNota.aprobacion_maxima = body.aprobacion_maxima;
        capacitacionNota.factor = body.factor;
        usuario = req.usuario._id;

        capacitacionNota.save((err, capacitacionNotaGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar nota capacitacion',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                capacitacionNota: capacitacionNotaGuardado,
                usuario
            });
        });

    });

});

// ==============================================
//  Borrar nota de capacitacion por el id
// ==============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    CapacitacionNota.findByIdAndRemove(id, (err, capacitacionNotaBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar nota capacitacion',
                errors: err
            });
        }

        if (!capacitacionNotaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe nota capacitacion con ese id',
                errors: { message: 'No existe nota capacitacion con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            capacitacionNota: capacitacionNotaBorrado
        });
    });
});

module.exports = app;