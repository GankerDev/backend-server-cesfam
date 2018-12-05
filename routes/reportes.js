var express = require('express');

var app = express();
var Funcionario = require('../models/funcionario');
var Capacitacion = require('../models/capacitacion');

app.get('/', (req, res, next) => {
    let contador = 0;



});


Funcionario.find()
    .exec((err, funcionarios) => {
        for (let i = 0; i < funcionarios.length; i++) {
            Capacitacion.find()
                .exec((err, capacitaciones) => {
                    if (funcionarios[i].capacitacion.nombre_capacitacion === capacitaciones.nombre_capacitacion) {
                        contador++;
                    }
                })
        }
    });

module.exports = app;