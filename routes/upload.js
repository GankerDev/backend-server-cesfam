var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Funcionario = require('../models/funcionario');
var LicenciaMedica = require('../models/licenciaMedica');
var Categoria = require('../models/categoria');


app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipo de coleccion
    var tiposValidos = ['funcionario', 'licencia-medica', 'categoria', 'usuario'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no válida',
            errors: { message: 'Tipo de colección no válida' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No has seleccionado nada',
            errors: { message: 'Debes seleccionar un archivo' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.archivo;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Extensiones permitidas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'doc', 'docm', 'docx', 'pdf'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });
    }

    // Cambiar nombre de archivo
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover el archivo del temporal al un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }
        var fs = require('fs');
        subirPorTipo(tipo, id, nombreArchivo, res);

    });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === 'usuario') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }


            var pathViejo = './uploads/usuario/' + usuario.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });

            })


        });

    }
    if (tipo === 'funcionario') {
        Funcionario.findById(id, (err, funcionario) => {

            if (!funcionario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Funcionario no existe',
                    errors: { message: 'Funcionario no existe' }
                });
            }


            var pathViejo = './uploads/funcionario/' + funcionario.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            funcionario.img = nombreArchivo;

            funcionario.save((err, funcionarioActualizado) => {

                funcionarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de funcionario actualizada',
                    funcionario: funcionarioActualizado
                });

            })
        });
    }
    if (tipo === 'licencia-medica') {
        LicenciaMedica.findById(id, (err, licenciaMedica) => {

            if (!licenciaMedica) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Licencia médica no existe',
                    errors: { message: 'Licencia médica no existe' }
                });
            }


            var pathViejo = './uploads/licenciaMedica/' + licenciaMedica.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            licenciaMedica.img = nombreArchivo;

            licenciaMedica.save((err, licenciaMedicaActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Licencia médica actualizada',
                    licenciaMedica: licenciaMedicaActualizado
                });

            })


        });
    }
    if (tipo === 'categoria') {
        Categoria.findById(id, (err, categoria) => {

            if (!categoria) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Categoria no existe',
                    errors: { message: 'Categoria no existe' }
                });
            }


            var pathViejo = './uploads/categoria/' + categoria.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            categoria.img = nombreArchivo;

            categoria.save((err, categoriaActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de categoria actualizada',
                    categoria: categoriaActualizado
                });

            })


        });
    }
}

module.exports = app;