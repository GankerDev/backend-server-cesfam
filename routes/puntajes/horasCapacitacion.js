var express = require('express');

var mdAutenticacion = require('../../middlewares/autenticacion');

var app = express();

var DuracionCAP = require('../../models/puntajes/horasCapacitacion');

// ==============================================
//  Obtener todos puntajes
// ==============================================

app.get('/', (req, res, next) => {

    DuracionCAP.find({})
        .populate('usuario', 'nombre email')
        .exec(
            (err, duracionCap) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando datos',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    duracionCap: duracionCap
                });

            })
});

// ==============================================
//  Obtener puntaje AB por ID
// ==============================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    DuracionCAP.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, duracionCap) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar elemento',
                    errors: err
                });
            }
            if (!duracionCap) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El elemento con el id ' + id + ' no existe',
                    errors: { message: 'No existe un elemento con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                duracionCap: duracionCap
            });
        });
});

// ==============================================
//  Crear nuevo puntaje
// ==============================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var puntaje = new DuracionCAP({
        min: body.min,
        max: body.max,
        puntaje: body.puntaje,
        usuario: req.usuario._id
    });

    puntaje.save((err, duracionCapGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear elemento',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            duracionCapGuardado: duracionCapGuardado
        });
    });

});

// ==============================================
//  Actualizar puntaje
// ==============================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    DuracionCAP.findById(id, (err, duracionCap) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El elemento con el id ' + id + ' no existe',
                errors: { message: 'No existe el elemento con ese ID' }
            });
        }

        duracionCap.min = body.min;
        duracionCap.max = body.max;
        duracionCap.puntaje = body.puntaje;
        duracionCap.usuario = req.usuario._id;

        duracionCap.save((err, duracionCapGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar elemento',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                duracionCapGuardado: duracionCapGuardado
            });
        });

    });

});

// ==============================================
//  Borrar un puntaje por el id
// ==============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    DuracionCAP.findByIdAndRemove(id, (err, duracionCapBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar elemento',
                errors: err
            });
        }

        if (!duracionCapBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un elemento con ese id',
                errors: { message: 'No existe un elemento con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            duracionCapBorrado: duracionCapBorrado
        });
    });
});

module.exports = app;