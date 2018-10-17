// Requires
var express = require('express');
var mongoose = require('mongoose');

// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');

//Inicializar varriables
var app = express();

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/cesfamDB', (err, res) => {
    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Server: 3000 \x1b[32m%s\x1b[0m', 'online');
});