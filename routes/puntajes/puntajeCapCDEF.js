var express = require('express');

var mdAutenticacion = require('../../middlewares/autenticacion');

var app = express();

var PuntajeCapCDEF = require('../../models/puntajes/puntajeCapCDEF');

// ==============================================
//  Obtener todos los puntajes
// ==============================================

app.get('/', (req, res, next) => {

    PuntajeCapCDEF.find({})
        .populate('usuario', 'nombre email')
        .exec(
            (err, puntajes) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando puntaje',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    puntajeCapCDEF: puntajes
                });

            })
});

// ==============================================
//  Obtener puntaje capacitación CDEF por ID
// ==============================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    PuntajeCapCDEF.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, puntajeCapCDEF) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar puntaje',
                    errors: err
                });
            }
            if(!puntajeCapCDEF){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El puntaje con el id '+ id + ' no existe',
                    errors: {message: 'No existe un puntaje con ese ID'}
                });
            }
            res.status(200).json({
                ok: true,
                puntajeCapCDEF: puntajeCapCDEF
            });
        })
});

// ==============================================
//  Crear nuevo puntaje
// ==============================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var puntaje = new PuntajeCapCDEF({
        rango_min: body.rango_min,
        rango_max: body.rango_max,
        puntaje: body.puntaje,
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
            puntajeCapCDEF: puntajeGuardado,
        });
    });

});

// ==============================================
//  Actualizar puntaje
// ==============================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    PuntajeCapCDEF.findById(id, (err, puntaje) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El puntaje con el id ' + id + ' no existe',
                errors: { message: 'No existe puntaje con ese ID' }
            });
        }

        puntaje.rango_min = body.rango_min;
        puntaje.rango_max = body.rango_max;
        puntaje.puntaje = body.puntaje;
        puntaje.usuario = req.usuario._id;

        puntaje.save((err, puntajeGuardado) => {
            if (err) {
                e
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar puntaje',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                puntajeCapCDEF: puntajeGuardado
            });
        });

    });

});

// ==============================================
//  Borrar un puntaje por el id
// ==============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    PuntajeCapCDEF.findByIdAndRemove(id, (err, puntajeBorrado) => {
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
            puntajeCapCDEF: puntajeBorrado
        });
    });
});

module.exports = app;