var express = require('express');

var mdAutenticacion = require('../../middlewares/autenticacion');

var app = express();

var PuntajeExp = require('../../models/puntajes/puntajeExp');

// ==============================================
//  Obtener todos los puntajes
// ==============================================

app.get('/', (req, res, next) => {

    PuntajeExp.find({})
        .populate('usuario', 'nombre email')
        .exec(
            (err, Puntajes) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando puntaje',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    puntajeExp: Puntajes
                });

            })
});

// ==============================================
//  Obtener puntaje experiencia por ID
// ==============================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    PuntajeExp.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, puntajeExp) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar puntaje',
                    errors: err
                });
            }
            if(!puntajeExp){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El puntaje con el id '+ id + ' no existe',
                    errors: {message: 'No existe un puntaje con ese ID'}
                });
            }
            res.status(200).json({
                ok: true,
                puntajeExp: puntajeExp
            });
        })
});

// ==============================================
//  Crear nuevo puntaje
// ==============================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var puntaje = new PuntajeExp({
        bienio: body.bienio,
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
            puntajeExp: puntajeGuardado,
        });
    });

});

// ==============================================
//  Actualizar puntaje
// ==============================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    PuntajeExp.findById(id, (err, puntaje) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El puntaje con el id ' + id + ' no existe',
                errors: { message: 'No existe puntaje con ese ID' }
            });
        }

        puntaje.bienio = body.bienio;
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
                puntajeExp: puntajeGuardado
            });
        });

    });

});

// ==============================================
//  Borrar una puntaje por el id
// ==============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    PuntajeExp.findByIdAndRemove(id, (err, puntajeBorrado) => {
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
            puntajeExp: puntajeBorrado
        });
    });
});

module.exports = app;