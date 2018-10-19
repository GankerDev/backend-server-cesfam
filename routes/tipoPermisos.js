var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var TipoPermiso = require('../models/tipoPermisos');

// ==============================================
//  Obtener todos los tipos de permisos
// ==============================================

app.get('/', (req, res, next) => {

    TipoPermiso.find({})
        .exec(
            (err, tipoPermisos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando tipo de permiso',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    tipoPermisos: tipoPermisos
                });

            })
});

// ==============================================
//  Crear nuevo tipo de permiso
// ==============================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var tipoPermiso = new TipoPermiso({
        nombre: body.nombre
    });

    tipoPermiso.save((err, tipoPermisoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear tipo de permiso',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            tipoPermiso: tipoPermisoGuardado
        });
    });

});

// ==============================================
//  Actualizar tipo de permiso
// ==============================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    TipoPermiso.findById(id, (err, tipoPermiso) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El tipo de permiso con el id ' + id + ' no existe',
                errors: { message: 'No existe un tipo de permiso con ese ID' }
            });
        }

        tipoPermiso.nombre = body.nombre;

        tipoPermiso.save((err, tipoPermisoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar el tipo de permiso',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                tipoPermiso: tipoPermisoGuardado
            });
        });

    });

});

// ==============================================
//  Borrar un tipo de permiso por el id
// ==============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    TipoPermiso.findByIdAndRemove(id, (err, tipoPermisoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar tipo de permiso',
                errors: err
            });
        }

        if (!tipoPermisoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un tipo de permiso con ese id',
                errors: { message: 'No existe un tipo de permiso con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            tipoPermiso: tipoPermisoBorrado
        });
    });
});

module.exports = app;