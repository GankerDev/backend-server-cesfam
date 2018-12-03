var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// ==============================================
//  Verificar token
// ==============================================
exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();
    });

}

// ==============================================
//  Verificar admin
// ==============================================
exports.verificaAdmin = function(req, res, next) {

    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'No tienes permiso',
            errors: { message: 'No tienes permiso' }
        });
    }
}

// ==============================================
//  Verificar admin o mismo usuario
// ==============================================
exports.verificaAdminMismoUsuario = function(req, res, next) {

    var usuario = req.usuario;
    var id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'No tienes permiso y no eres el mismo usuario',
            errors: { message: 'No tienes permiso y no eres el mismo usuario' }
        });
    }
}