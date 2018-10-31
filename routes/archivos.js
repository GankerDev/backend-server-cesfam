var express = require('express');

var app = express();

const path = require('path');
const fs = require('fs');

app.get('/:tipo/:archivo', (req, res, next) => {

    var tipo = req.params.tipo;
    var archivo = req.params.archivo;

    var pathArchivo = path.resolve(__dirname, `../uploads/${tipo}/${archivo}`);

    if (fs.existsSync(pathArchivo)) {
        res.sendFile(pathArchivo);
    } else {
        var pathNoArchivo = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoArchivo);
    }
});

module.exports = app;