var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var TipoCategoria = require('../models/tipoCategoria');

// ==============================================
//  Obtener todos los tipos de categorias
// ==============================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    TipoCategoria.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, tipoCategorias) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando tipo de categoria',
                        errors: err
                    });
                }

                TipoCategoria.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        tipoCategorias: tipoCategorias,
                        total: conteo
                    });
                });

            });
});

// ==============================================
//  Obtener tipo de categoria por ID
// ==============================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    TipoCategoria.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, tipoCategoria) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar tipo categoria',
                    errors: err
                });
            }
            if(!tipoCategoria){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El tipo categoria con el id '+ id + ' no existe',
                    errors: {message: 'No existe un tipo categoria con ese ID'}
                });
            }
            res.status(200).json({
                ok: true,
                tipoCategoria: tipoCategoria
            });
        })
});

// ==============================================
//  Crear nuevo tipo de categoria
// ==============================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var tipoCategoria = new TipoCategoria({
        nivel: body.nivel
    });

    tipoCategoria.save((err, tipoCategoriaGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear tipo de categoria',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            tipoCategoria: tipoCategoriaGuardado
        });
    });

});

// ==============================================
//  Actualizar tipo de categoria
// ==============================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    TipoCategoria.findById(id, (err, tipoCategoria) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El tipo de categoria con el id ' + id + ' no existe',
                errors: { message: 'No existe un tipo de categoria con ese ID' }
            });
        }

        tipoCategoria.nivel = body.nivel;
        usuario = req.usuario._id;

        tipoCategoria.save((err, tipoCategoriaGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar el tipo de categoria',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                tipoCategoria: tipoCategoriaGuardado
            });
        });

    });

});

// ==============================================
//  Borrar un tipo de categoria por el id
// ==============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    TipoCategoria.findByIdAndRemove(id, (err, tipoCategoriaBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar tipo de categoria',
                errors: err
            });
        }

        if (!tipoCategoriaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un tipo de categoria con ese id',
                errors: { message: 'No existe un tipo de categoria con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            tipoCategoria: tipoCategoriaBorrado
        });
    });
});

module.exports = app;