var express = require('express');

var mdAutenticacion = require('../../middlewares/autenticacion');

var app = express();

var PuntajeCapAB = require('../../models/puntajes/puntajeCapAB');

// ==============================================
//  Obtener todos los puntajes
// ==============================================

app.get('/', (req, res, next) => {

    PuntajeCapAB.find({})
        .populate('usuario', 'nombre email')
        .exec(
            (err, Puntajes) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando puntajes',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    puntajeCapAB: Puntajes
                });

            });
});

// ==============================================
//  Obtener puntaje capacitación AB por ID
// ==============================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    PuntajeCapAB.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, puntajeCapAB) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar puntaje',
                    errors: err
                });
            }
            if(!puntajeCapAB){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El puntaje con el id '+ id + ' no existe',
                    errors: {message: 'No existe un puntaje con ese ID'}
                });
            }
            res.status(200).json({
                ok: true,
                puntajeCapAB: puntajeCapAB
            });
        })
});

// ==============================================
//  Crear nuevo puntaje
// ==============================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var puntajeCapAB = new PuntajeCapAB({
        rango_min: body.rango_min,
        rango_max: body.rango_max,
        puntaje: body.puntaje,
        usuario: req.usuario._id
    });

    puntajeCapAB.save((err, puntajeCapABGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear puntaje',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            puntajeCapAB: puntajeCapABGuardado
        });
    });

});

// ==============================================
//  Actualizar puntaje
// ==============================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    PuntajeCapAB.findById(id, (err, puntaje) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La capacitacion con el id ' + id + ' no existe',
                errors: { message: 'No existe capacitacion con ese ID' }
            });
        }

        puntaje.rango_min = body.rango_min;
        puntaje.rango_max = body.rango_max;
        puntaje.puntaje = body.puntaje;
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
                puntajeCapAB: puntajeGuardado
            });
        });

    });

});

// ==============================================
//  Borrar un puntaje por el id
// ==============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    PuntajeCapAB.findByIdAndRemove(id, (err, puntajeBorrado) => {
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
            puntajeCapAB: puntajeBorrado
        });
    });
});

module.exports = app;