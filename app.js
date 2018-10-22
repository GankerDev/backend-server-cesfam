// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var tipoPermisoRoutes = require('./routes/tipoPermisos');
var permisoRoutes = require('./routes/permiso');
var feriadoLegalRoutes = require('./routes/feriadoLegal');
var licenciaMedicaRoutes = require('./routes/licenciaMedica');
var tipoCategoriaRoutes = require('./routes/tipoCategoria');
var categoriaRoutes = require('./routes/categoria');
var capacitacionRoutes = require('./routes/capacitacion');
var funcionarioRoutes = require('./routes/funcionario');

//Inicializar varriables
var app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/cesfamDB', (err, res) => {
    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.use('/funcionario', funcionarioRoutes);
app.use('/capacitacion', capacitacionRoutes);
app.use('/categoria', categoriaRoutes);
app.use('/tipo-categoria', tipoCategoriaRoutes);
app.use('/licencia-medica', licenciaMedicaRoutes);
app.use('/feriado-legal', feriadoLegalRoutes);
app.use('/permiso', permisoRoutes);
app.use('/tipo-permiso', tipoPermisoRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Server: 3000 \x1b[32m%s\x1b[0m', 'online');
});