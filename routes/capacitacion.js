var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Capacitacion = require('../models/capacitacion');

// ==============================================
//  Obtener todos las capacitaciones
// ==============================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Capacitacion.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, Capacitaciones) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando capacitacion',
                        errors: err
                    });
                }
                Capacitacion.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        Capacitaciones: Capacitaciones,
                        total: conteo
                    });
                });

            })
});

// ==============================================
//  Crear nueva capacitacion
// ==============================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var capacitacion = new Capacitacion({
        nombre_capacitacion: body.nombre_capacitacion,
        descripcion_capacitacion: body.descripcion_capacitacion,
        usuario: req.usuario._id
    });

    capacitacion.save((err, capacitacionGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear tipo de capacitacion',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            capacitacion: capacitacionGuardado,
        });
    });

});

// ==============================================
//  Actualizar capacitacion
// ==============================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Capacitacion.findById(id, (err, capacitacion) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La capacitacion con el id ' + id + ' no existe',
                errors: { message: 'No existe capacitacion con ese ID' }
            });
        }

        capacitacion.nombre_capacitacion = body.nombre_capacitacion;
        capacitacion.descripcion_capacitacion = body.descripcion_capacitacion;
        capacitacion.usuario = req.usuario._id;

        capacitacion.save((err, capacitacionGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar capacitacion',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                capacitacion: capacitacionGuardado,
            });
        });

    });

});

// ==============================================
//  Borrar una capacitacion por el id
// ==============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Capacitacion.findByIdAndRemove(id, (err, capacitacionBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar capacitacion',
                errors: err
            });
        }

        if (!capacitacionBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una capacitacion con ese id',
                errors: { message: 'No existe una capacitacion con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            capacitacion: capacitacionBorrado
        });
    });
});

module.exports = app;