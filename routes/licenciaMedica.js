var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var LicenciaMedica = require('../models/licenciaMedica');

// ==============================================
//  Obtener todos las licencias medicas
// ==============================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    LicenciaMedica.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate( 'funcionario' )
        .exec(
            (err, licenciasMedicas) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando licencias medicas',
                        errors: err
                    });
                }

                LicenciaMedica.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        licenciasMedicas,
                        total: conteo
                    });
                });

            });
});

// ==============================================
//  Obtener licencia medica por ID
// ==============================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    LicenciaMedica.findById(id)
        .populate('usuario', 'nombre img email')
        .populate( 'funcionario' )
        .exec((err, licenciaMedica) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar licencia medica',
                    errors: err
                });
            }
            if(!licenciaMedica){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La licencia medica con el id '+ id + ' no existe',
                    errors: {message: 'No existe una licencia médica con ese ID'}
                });
            }
            res.status(200).json({
                ok: true,
                licenciaMedica: licenciaMedica
            });
        })
});

// ==============================================
//  Crear nueva licencia medica
// ==============================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var licenciaMedica = new LicenciaMedica({
        cant_licencias_pedidas: body.cant_licencias_pedidas,
        cant_dias_licencia: body.cant_dias_licencia,
        desde: body.desde,
        hasta: body.hasta,
        numero_licencia: body.numero_licencia,
        entidad_pagadora: body.entidad_pagadora,
        renta1: body.renta1,
        renta2: body.renta2,
        renta3: body.renta3,
        promedio: body.promedio,
        funcionario: body.funcionario,
        usuario: req.usuario._id
    });

    licenciaMedica.save((err, licenciaMedicaGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear licencia médica',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            licenciaMedica: licenciaMedicaGuardado
        });
    });

});

// ==============================================
//  Actualizar licencia medica
// ==============================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    LicenciaMedica.findById(id, (err, licenciaMedica) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El licenciaMedica con el id ' + id + ' no existe',
                errors: { message: 'No existe un licenciaMedica con ese ID' }
            });
        }

        licenciaMedica.cant_licencias_pedidas = body.cant_licencias_pedidas;
        licenciaMedica.cant_dias_licencia = body.cant_dias_licencia;
        licenciaMedica.desde = body.desde;
        licenciaMedica.hasta = body.hasta;
        licenciaMedica.numero_licencia = body.numero_licencia;
        licenciaMedica.entidad_pagadora = body.entidad_pagadora;
        licenciaMedica.renta1 = body.renta1;
        licenciaMedica.renta2 = body.renta2;
        licenciaMedica.renta3 = body.renta3;
        licenciaMedica.usuario = req.usuario._id;
        licenciaMedica.funcionario = body.funcionario;

        licenciaMedica.save((err, licenciaMedicaGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el licencia medica',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                licenciaMedica: licenciaMedicaGuardado
            });
        });

    });

});

// ==============================================
//  Borrar un licenciaMedica por el id
// ==============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    LicenciaMedica.findByIdAndRemove(id, (err, licenciaMedicaBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar licencia medica',
                errors: err
            });
        }

        if (!licenciaMedicaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una licencia medica con ese id',
                errors: { message: 'No existe una licencia medica con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            licenciaMedica: licenciaMedicaBorrado
        });
    });
});

module.exports = app;