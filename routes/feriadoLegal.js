var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var FeriadoLegal = require('../models/feriadoLegal');

// ==============================================
//  Obtener todos los feriados legales
// ==============================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    FeriadoLegal.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, feriadosLegales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando feriado legal',
                        errors: err
                    });
                }
                FeriadoLegal.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        feriadosLegales: feriadosLegales,
                        total: conteo
                    });
                });

            })
});

// ==============================================
//  Obtener feriado legal por ID
// ==============================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    FeriadoLegal.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, feriadoLegal) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar feriado legal',
                    errors: err
                });
            }
            if(!feriadoLegal){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El feriado legal con el id '+ id + ' no existe',
                    errors: {message: 'No existe un feriado legal con ese ID'}
                });
            }
            res.status(200).json({
                ok: true,
                feriadoLegal: feriadoLegal
            });
        })
});

// ==============================================
//  Crear nuevo feriado legal
// ==============================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var feriadoLegal = new FeriadoLegal({
        dias_vacaciones_fijos: body.dias_vacaciones_fijos,
        dias_vacaciones_acumulados: body.dias_vacaciones_acumulados,
        fecha_inicio_vacaciones: body.fecha_inicio_vacaciones,
        fecha_termino_vacaciones: body.fecha_termino_vacaciones,
        dias_vacaciones_restantes: body.dias_vacaciones_restantes,
        usuario: req.usuario._id
    });

    feriadoLegal.save((err, feriadoLegalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear feriado legal',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            feriadoLegal: feriadoLegalGuardado
        });
    });

});

// ==============================================
//  Actualizar feriado legal
// ==============================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    FeriadoLegal.findById(id, (err, feriadoLegal) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El feriado legal con el id ' + id + ' no existe',
                errors: { message: 'No existe un feriado legal con ese ID' }
            });
        }

        feriadoLegal.dias_vacaciones_fijos = body.dias_vacaciones_fijos,
            feriadoLegal.dias_vacaciones_acumulados = body.dias_vacaciones_acumulados,
            feriadoLegal.fecha_inicio_vacaciones = body.fecha_inicio_vacaciones,
            feriadoLegal.fecha_termino_vacaciones = body.fecha_termino_vacaciones,
            feriadoLegal.dias_vacaciones_restantes = body.dias_vacaciones_restantes,
            feriadoLegal.usuario = req.usuario._id

        feriadoLegal.save((err, feriadoLegalGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar el feriado legal',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                feriadoLegal: feriadoLegalGuardado
            });
        });

    });

});

// ==============================================
//  Borrar un Feriado legal por el id
// ==============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    FeriadoLegal.findByIdAndRemove(id, (err, feriadoLegalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar feriado legal',
                errors: err
            });
        }

        if (!feriadoLegalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un feriado legal con ese id',
                errors: { message: 'No existe un feriado legal con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            feriadoLegal: feriadoLegalBorrado
        });
    });
});

module.exports = app;