var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Categoria = require('../models/categoria');

// ==============================================
//  Obtener todos las categorias
// ==============================================

app.get('/', (req, res, next) => {

    Categoria.find({})
        .exec(
            (err, Categorias) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando categoria',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    Categorias: Categorias
                });

            })
});

// ==============================================
//  Crear nueva categoria
// ==============================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var categoria = new Categoria({
        nombre_cargo_funcionario: body.nombre_cargo_funcionario,
        descripcion_cargo_funcionario: body.descripcion_cargo_funcionario,
        tipoCategoria: body.tipoCategoria
    });

    categoria.save((err, categoriaGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear tipo de categoria',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            categoria: categoriaGuardado
        });
    });

});

// ==============================================
//  Actualizar categoria
// ==============================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Categoria.findById(id, (err, categoria) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La categoria con el id ' + id + ' no existe',
                errors: { message: 'No existe categoria con ese ID' }
            });
        }

        categoria.nombre_cargo_funcionario = body.nombre_cargo_funcionario;
        categoria.descripcion_cargo_funcionario = body.descripcion_cargo_funcionario;
        categoria.tipoCategoria = body.tipoCategoria;
        usuario = req.usuario._id;

        categoria.save((err, categoriaGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar categoria',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                categoria: categoriaGuardado
            });
        });

    });

});

// ==============================================
//  Borrar una categoria por el id
// ==============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar categoria',
                errors: err
            });
        }

        if (!categoriaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una categoria con ese id',
                errors: { message: 'No existe una categoria con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            categoria: categoriaBorrado
        });
    });
});

module.exports = app;