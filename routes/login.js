'use strict'
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');

// Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


// ===================================================================
//      Autenticación de Google
// ===================================================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {

    var token = req.body.token;

    var googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                mensaje: 'Token no válido',
                err: e
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe usar su autenticación normal'
                });
            } else {
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB.id,
                    menu: obtenerMenu(usuario.role)
                });
            }
        } else {
            // El usuario no existe... Crear
            var usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB.id,
                    menu: obtenerMenu(usuarioDB.role)
                });
            });
        }
    });

});

// ===================================================================
//      Autenticación normal
// ===================================================================

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err
            });
        }

        // Crear un token!!!
        usuarioDB.password = ':)';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB.id,
            menu: obtenerMenu(usuarioDB.role)
        });
    });
});

function obtenerMenu(role) {

    var menu = [ //{
        //         titulo: 'Principal',
        //         icono: 'mdi mdi-gauge',
        //         submenu: [
        //             { titulo: 'Dashboard', url: '/dashboard' },
        //             { titulo: 'ProgressBar', url: '/progress' },
        //             { titulo: 'Gráficas', url: '/graficas1' },
        //             { titulo: 'Ajustes de tema', url: '/account-settings' },
        //             { titulo: 'Promesas', url: '/promesas' },
        //             { titulo: 'Rxjs', url: '/rxjs' }
        //         ]
        //     },
        {
            titulo: 'Mantenimiento',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                //{ titulo: 'Usuarios', url: '/usuarios' },
                { titulo: 'Capacitación', url: '/capacitaciones' },
                { titulo: 'Categoría', url: '/categorias' },
                { titulo: 'Feriado legal', url: '/feriado-legal' },
                { titulo: 'Funcionarios', url: '/funcionarios' },
                { titulo: 'Licencias medicas', url: '/licencia-medica' },
                { titulo: 'Permisos', url: '/permisos' },
                { titulo: 'Tipo Categoría', url: '/tipo-categoria' },
                { titulo: 'Tipo Contrato', url: '/tipo-contrato' },
                { titulo: 'Tipo Permiso', url: '/tipo-permiso' }
            ]
        },
        {
            titulo: 'Puntajes',
            icono: 'mdi mdi-settings',
            submenu: [
                { titulo: 'Capacitación nivel técnico', url: '/cap-nivel-tecnicos' },
                { titulo: 'Nota Capacitación', url: '/cap-notas' },
                { titulo: 'Duración capacitación', url: '/horas-caps' },
                { titulo: 'Puntaje A-B', url: '/puntajeAbs' },
                { titulo: 'Puntaje C-D-E-F', url: '/puntajeCDEFs' },
                { titulo: 'Puntaje capacitación A-B', url: '/puntaje-cap-abs' },
                { titulo: 'Puntaje capacitación C-D-E-F', url: '/puntaje-cap-cdefs' },
                { titulo: 'Puntaje experiencia', url: '/puntaje-exps' }
            ]
        },
        {
            titulo: 'Reportes',
            icono: 'fa fa-archive',
            submenu: [
                { titulo: 'Permisos', url: '/reporte-permisos' },
                { titulo: 'Capacitaciones por funcionario', url: '/reporte-capacitaciones' }
            ]
        }
    ];

    if (role === 'ADMIN_ROLE') {
        menu[0].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' });
    }

    return menu;
}


module.exports = app;