var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Permiso = require('../models/permiso');

// ==============================================
//  Obtener todos los permisos
// ==============================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Permiso.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('tipoPermisos')
        .populate( 'funcionario' )
        .exec(
            (err, permisos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando permisos',
                        errors: err
                    });
                }
                Permiso.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        permisos,
                        total: conteo
                    });
                });

            });
});

// ==============================================
//  Obtener permiso por ID
// ==============================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Permiso.findById(id)
        .populate('usuario', 'nombre img email')
        .populate( 'funcionario' )
        .populate('tipoPermisos')
        .exec((err, permiso) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar permiso',
                    errors: err
                });
            }
            if(!permiso){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El permiso con el id '+ id + ' no existe',
                    errors: {message: 'No existe un permiso con ese ID'}
                });
            }
            res.status(200).json({
                ok: true,
                permiso: permiso
            });
        })
});

// ==============================================
//  Crear nuevo permiso
// ==============================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var permiso = new Permiso({
        fecha: body.fecha,
        dias_fijos: body.dias_fijos,
        tiempo_permiso: body.tiempo_permiso,
        dias_restantes: body.dias_restantes,
        dias_adm_fijos: body.dias_adm_fijos,
        dias_adm_acumulados: body.dias_adm_acumulados,
        funcionario: body.funcionario,
        usuario: req.usuario._id,
        tipoPermisos: body.tipoPermisos
    });

    permiso.save((err, permisoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear permiso',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            permiso: permisoGuardado
        });
    });

});

// ==============================================
//  Actualizar permiso
// ==============================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Permiso.findById(id, (err, permiso) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El permiso con el id ' + id + ' no existe',
                errors: { message: 'No existe un permiso con ese ID' }
            });
        }

        permiso.fecha = body.fecha;
        permiso.dias_fijos = body.dias_fijos;
        permiso.tiempo_permiso = body.tiempo_permiso;
        permiso.dias_restantes = body.dias_restantes;
        permiso.dias_adm_fijos = body.dias_adm_fijos;
        permiso.dias_adm_acumulados = body.dias_adm_acumulados;
        permiso.funcionario = body.funcionario;
        permiso.usuario = req.usuario._id;
        permiso.tipoPermisos = body.tipoPermisos

        permiso.save((err, permisoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el permiso',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                permiso: permisoGuardado
            });
        });

    });

});

// ==============================================
//  Borrar un permiso por el id
// ==============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Permiso.findByIdAndRemove(id, (err, permisoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar permiso',
                errors: err
            });
        }

        if (!permisoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un permiso con ese id',
                errors: { message: 'No existe un permiso con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            permiso: permisoBorrado
        });
    });
});

module.exports = app;