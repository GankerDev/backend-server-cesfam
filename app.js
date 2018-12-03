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
var tipoContratoRoutes = require('./routes/tipoContrato');
//Rutas Puntajes
var capacitacionNivelTecnicoRoutes = require('./routes/puntajes/capacitacionNivelTecnico');
var capacitacionNotaRoutes = require('./routes/puntajes/capacitacionNota');
var puntajeABRoutes = require('./routes/puntajes/puntajeAB');
var puntajeCDEFRoutes = require('./routes/puntajes/puntajeCDEF');
var puntajeCapABRoutes = require('./routes/puntajes/puntajeCapAb');
var puntajeCapCDEFRoutes = require('./routes/puntajes/puntajeCapCDEF');
var puntajeExpRoutes = require('./routes/puntajes/puntajeExp');
var horasCapRoutes = require('./routes/puntajes/horasCapacitacion');
// Busqueda
var busquedaRoutes = require('./routes/busqueda');
// Subir archivos
var uploadRoutes = require('./routes/upload');
var archivosRoutes = require('./routes/archivos');

// Calculo de puntajes
var calculoPuntajeRoutes = require('./routes/calcularPuntaje');

//Inicializar varriables
var app = express();

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/cesfamDB', (err, res) => {
    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// Server index config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));


//Rutas Puntajes
app.use('/cap-nivel-tecnico', capacitacionNivelTecnicoRoutes);
app.use('/cap-nota', capacitacionNotaRoutes);
app.use('/puntajeAb', puntajeABRoutes);
app.use('/puntajeCDEF', puntajeCDEFRoutes);
app.use('/puntaje-cap-ab', puntajeCapABRoutes);
app.use('/puntaje-cap-cdef', puntajeCapCDEFRoutes);
app.use('/puntaje-exp', puntajeExpRoutes);
app.use('/horas-cap', horasCapRoutes);

//Calculo Puntaje
app.use('/calcular-puntaje', calculoPuntajeRoutes);

// Rutas
app.use('/upload', uploadRoutes);
app.use('/archivos', archivosRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/tipo-contrato', tipoContratoRoutes);
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