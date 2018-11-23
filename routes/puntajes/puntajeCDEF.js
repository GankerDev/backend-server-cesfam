var express = require('express');

var mdAutenticacion = require('../../middlewares/autenticacion');

var app = express();

var PuntajeCDEF = require('../../models/puntajes/puntajeCDEF');

// ==============================================
//  Obtener todos los puntajes
// ==============================================

app.get('/', (req, res, next) => {

    PuntajeCDEF.find({})
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
                    puntajeCDEF: Puntajes
                });

            })
});

// ==============================================
//  Obtener puntaje CDEF por ID
// ==============================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    PuntajeCDEF.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, puntajeCDEF) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar puntaje',
                    errors: err
                });
            }
            if(!puntajeCDEF){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El puntaje con el id '+ id + ' no existe',
                    errors: {message: 'No existe un puntaje con ese ID'}
                });
            }
            res.status(200).json({
                ok: true,
                puntajeCDEF: puntajeCDEF
            });
        })
});

// ==============================================
//  Crear nuevo puntaje
// ==============================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var puntaje = new PuntajeCDEF({
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
            puntajeCDEF: puntajeGuardado,
        });
    });

});

// ==============================================
//  Actualizar puntaje
// ==============================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    PuntajeCDEF.findById(id, (err, puntaje) => {

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
                puntajeCDEF: puntajeGuardado,
            });
        });

    });

});

// ==============================================
//  Borrar un puntaje por el id
// ==============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    PuntajeCDEF.findByIdAndRemove(id, (err, puntajeBorrado) => {
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
            puntajeCDEF: puntajeBorrado
        });
    });
});

module.exports = app;