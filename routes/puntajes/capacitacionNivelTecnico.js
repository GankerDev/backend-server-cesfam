var express = require('express');

var mdAutenticacion = require('../../middlewares/autenticacion');

var app = express();

var capacitacionNT = require('../../models/puntajes/capacitacionNivelTecnico');

// ==============================================
//  Obtener capacitacion Nivel Tecnico
// ==============================================

app.get('/', (req, res, next) => {

    CapacitacionNT.find({})
        .exec(
            (err, CapacitacionesNT) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando capacitacion nivel tecnico',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    CapacitacionesNT: CapacitacionesNT
                });

            })
});

// ==============================================
//  Crear nueva capacitacion
// ==============================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var capacitacionNT = new CapacitacionNT({
        nivel_tecnico: body.nivel_tecnico,
        factor: body.factor,
        usuario: req.usuario._id
    });

    capacitacionNT.save((err, capacitacionNTGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear tipo de capacitacion',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            capacitacionNT: capacitacionNTGuardado,
            usuario: req.usuario._id
        });
    });

});

// ==============================================
//  Actualizar capacitacion
// ==============================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    CapacitacionNT.findById(id, (err, capacitacionNT) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La capacitacion con el id ' + id + ' no existe',
                errors: { message: 'No existe capacitacion con ese ID' }
            });
        }

        capacitacionNT.nivel_tecnico = body.nivel_tecnico;
        capacitacionNT.factor = body.factor;
        usuario = req.usuario._id;

        capacitacionNT.save((err, capacitacionNTGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar capacitacion',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                capacitacionNT: capacitacionNTGuardado,
                usuario
            });
        });

    });

});

// ==============================================
//  Borrar una capacitacion por el id
// ==============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    CapacitacionNT.findByIdAndRemove(id, (err, capacitacionNTBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar capacitacion',
                errors: err
            });
        }

        if (!capacitacionNTBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una capacitacion nivel tecnico con ese id',
                errors: { message: 'No existe una capacitacion nivel tecnico con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            capacitacionNT: capacitacionNTBorrado
        });
    });
});

module.exports = app;