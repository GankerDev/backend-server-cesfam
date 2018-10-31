var express = require('express');

var app = express();

var Capacitacion = require('../models/capacitacion');
var Categoria = require('../models/categoria');
var Funcionario = require('../models/funcionario');
var TipoCategoria = require('../models/tipoCategoria');
var TipoContrato = require('../models/tipoContrato');
var Usuario = require('../models/usuario');

//===================================================
// Busqueda por colección
//===================================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuario(busqueda, regex);
            break;
        case 'capacitacion':
            promesa = buscarCapacitacion(busqueda, regex);
            break;
        case 'categoria':
            promesa = buscarCategoria(busqueda, regex);
            break;
        case 'funcionario':
            promesa = buscarFuncionario(busqueda, regex);
            break;
        case 'tipoCategoria':
            promesa = buscarTipoCategoria(busqueda, regex);
            break;
        case 'tipoContrato':
            promesa = buscarTipoContrato(busqueda, regex);
            break;
        default:
            res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda son solo: usuario, capacitación, categoria, funcionario, tipo categoría, tipo contrato',
                error: { message: 'Tipo de coleción no válido' }
            });
    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    })

});

//===================================================
// Busqueda general
//===================================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarCapacitacion(busqueda, regex),
            buscarCategoria(busqueda, regex),
            buscarFuncionario(busqueda, regex),
            buscarTipoCategoria(busqueda, regex),
            buscarTipoContrato(busqueda, regex),
            buscarUsuario(busqueda, regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                capacitaciones: respuestas[0],
                categorias: respuestas[1],
                funcionarios: respuestas[2],
                tiposCategorias: respuestas[3],
                tiposContratos: respuestas[4],
                usuarios: respuestas[5]
            })
        })
});

function buscarCapacitacion(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Capacitacion.find({ nombre_capacitacion: regex })
            .populate('usuario', 'nombre email')
            .exec((err, capacitaciones) => {
                if (err) {
                    reject('Error al cargar capacitaciones', err);
                } else {
                    resolve(capacitaciones)
                }
            });
    });
}

function buscarCategoria(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Categoria.find({ nombre_cargo_funcionario: regex })
            .populate('usuario', 'nombre email')
            .populate('tipoCategoria')
            .exec((err, categorias) => {
                if (err) {
                    reject('Error al cargar categorias', err);
                } else {
                    resolve(categorias)
                }
            });
    });
}

function buscarFuncionario(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Funcionario.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('categoria_funcionario')
            .populate('licencia_medica')
            .populate('feriadoLegal')
            .populate('permiso')
            .populate('capacitacion')
            .exec((err, funcionarios) => {
                if (err) {
                    reject('Error al cargar funcionarios', err);
                } else {
                    resolve(funcionarios)
                }
            });
    });
}

function buscarTipoCategoria(busqueda, regex) {
    return new Promise((resolve, reject) => {

        TipoCategoria.find({ nivel: regex })
            .populate('usuario', 'nombre email')
            .exec((err, tiposCategorias) => {
                if (err) {
                    reject('Error al cargar tipos de categorias', err);
                } else {
                    resolve(tiposCategorias)
                }
            });
    });
}

function buscarTipoContrato(busqueda, regex) {
    return new Promise((resolve, reject) => {

        TipoContrato.find({ nombre_tipo_contrato: regex })
            .populate('usuario', 'nombre email')
            .exec((err, tiposContratos) => {
                if (err) {
                    reject('Error al cargar tipos de contratos', err);
                } else {
                    resolve(tiposContratos)
                }
            });
    });
}

function buscarUsuario(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;