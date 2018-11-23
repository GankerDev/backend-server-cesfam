var express = require('express');

var mdAutenticacion = require('../../middlewares/autenticacion');

var app = express();

var PuntajeAB = require('../../models/puntajes/puntajeAB');

// ==============================================
//  Obtener todos puntajes
// ==============================================

app.get('/', (req, res, next) => {

    PuntajeAB.find({})
        .populate('usuario', 'nombre email')
        .exec(
            (err, puntajes) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando puntajes',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    puntajeAB: puntajes
                });

            })
});

// ==============================================
//  Obtener puntaje AB por ID
// ==============================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    PuntajeAB.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, puntajeAB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar puntaje',
                    errors: err
                });
            }
            if (!puntajeAB) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El puntaje con el id ' + id + ' no existe',
                    errors: { message: 'No existe un puntaje con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                puntajeAB: puntajeAB
            });
        });
});

// ==============================================
//  Crear nuevo puntaje
// ==============================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var puntaje = new PuntajeAB({
        nivel: body.nivel,
        rango_min: body.rango_min,
        rango_max: body.rango_max,
        usuario: req.usuario._id
    });

    puntaje.save((err, puntajeGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear puntaje',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            puntajeAB: puntajeGuardado
        });
    });

});

// ==============================================
//  Actualizar puntaje
// ==============================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    PuntajeAB.findById(id, (err, puntaje) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El puntaje con el id ' + id + ' no existe',
                errors: { message: 'No existe puntaje con ese ID' }
            });
        }

        puntaje.nivel = body.nivel;
        puntaje.rango_min = body.rango_min;
        puntaje.rango_max = body.rango_max;
        puntaje.usuario = req.usuario._id;

        puntaje.save((err, puntajeGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar puntaje',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                puntajeAB: puntajeGuardado
            });
        });

    });

});

// ==============================================
//  Borrar un puntaje por el id
// ==============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    PuntajeAB.findByIdAndRemove(id, (err, puntajeBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar puntaje',
                errors: err
            });
        }

        if (!puntajeBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un puntaje con ese id',
                errors: { message: 'No existe un puntaje con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            puntajeAB: puntajeBorrado
        });
    });
});

module.exports = app;