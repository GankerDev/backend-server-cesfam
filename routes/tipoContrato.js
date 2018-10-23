var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var TipoContrato = require('../models/tipoContrato');

// ==============================================
//  Obtener todos los tipos de categorias
// ==============================================

app.get('/', (req, res, next) => {

    TipoContrato.find({})
        .exec(
            (err, tipoContratos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando tipo de contrato',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    tipoContratos: tipoContratos
                });

            })
});

// ==============================================
//  Crear nuevo tipo de contrato
// ==============================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var tipoContrato = new TipoContrato({
        nombre_tipo_contrato: body.nombre_tipo_contrato,
        descripcion_tipo_contrato: body.descripcion_tipo_contrato
    });

    tipoContrato.save((err, tipoContratoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear tipo de contrato',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            tipoContrato: tipoContratoGuardado
        });
    });

});

// ==============================================
//  Actualizar tipo de contrato
// ==============================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    TipoContrato.findById(id, (err, tipoContrato) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El tipo de contrato con el id ' + id + ' no existe',
                errors: { message: 'No existe un tipo de contrato con ese ID' }
            });
        }

        tipoContrato.nombre_tipo_contrato = body.nombre_tipo_contrato;
        tipoContrato.descripcion_tipo_contrato = body.descripcion_tipo_contrato;
        usuario = req.usuario._id;

        tipoContrato.save((err, tipoContratoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar el tipo de contrato',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                tipoContrato: tipoContratoGuardado
            });
        });

    });

});

// ==============================================
//  Borrar un tipo de contrato por el id
// ==============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    TipoContrato.findByIdAndRemove(id, (err, tipoContratoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar tipo de contrato',
                errors: err
            });
        }

        if (!tipoContratoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un tipo de contrato con ese id',
                errors: { message: 'No existe un tipo de contrato con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            tipoContrato: tipoContratoBorrado
        });
    });
});

module.exports = app;