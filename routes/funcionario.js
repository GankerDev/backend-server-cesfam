var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Funcionario = require('../models/funcionario');

// ==============================================
//  Obtener todos los funcionario
// ==============================================

app.get('/', (req, res, next) => {

    Funcionario.find({})
        .exec(
            (err, funcionarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando funcionarios',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    funcionarios: funcionarios
                });

            })
});

// ==============================================
//  Crear nuevo funcionario
// ==============================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var funcionario = new Funcionario({
        nombre: body.nombre,
        rut: body.rut,
        fecha_nacimiento: body.fecha_nacimiento,
        direccion: body.direccion,
        email: body.email,
        telefono: body.telefono,
        fecha_inicio_laboral: body.fecha_inicio_laboral,
        fecha_cumple_bienio: body.fecha_cumple_bienio,
        puntaje_cap_acumulado: body.puntaje_cap_acumulado,
        total_puntaje: body.total_puntaje,
        nivel_actual: body.nivel_actual,
        tipo_contrato: body.tipo_contrato,
        categoria_funcionario: body.categoria_funcionario,
        licencia_medica: body.licencia_medica,
        feriadoLegal: body.feriadoLegal,
        permiso: body.permiso,
        capacitacion: body.capacitacion,
        usuario: req.usuario._id
    });

    funcionario.save((err, funcionarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear funcionario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            funcionario: funcionarioGuardado,
            usuario: req.usuario._id
        });
    });

});

// ==============================================
//  Actualizar funcionario
// ==============================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Funcionario.findById(id, (err, funcionario) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El funcionario con el id ' + id + ' no existe',
                errors: { message: 'No existe un funcionario con ese ID' }
            });
        }

        funcionario.nombre = body.nombre;
        funcionario.rut = body.rut;
        funcionario.fecha_nacimiento = body.fecha_nacimiento;
        funcionario.direccion = body.direccion;
        funcionario.email = body.email;
        funcionario.telefono = body.telefono;
        funcionario.fecha_inicio_laboral = body.fecha_inicio_laboral;
        funcionario.fecha_cumple_bienio = body.fecha_cumple_bienio;
        funcionario.puntaje_cap_acumulado = body.puntaje_cap_acumulado;
        funcionario.total_puntaje = body.total_puntaje;
        funcionario.nivel_actual = body.nivel_actual;
        funcionario.tipo_contrato = body.tipo_contrato;
        funcionario.categoria_funcionario = body.categoria_funcionario;
        funcionario.licencia_medica = body.licencia_medica;
        funcionario.feriadoLegal = body.feriadoLegal;
        funcionario.permiso = body.permiso;
        funcionario.capacitacion = body.capacitacion;
        usuario = req.usuario._i;

        funcionario.save((err, funcionarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar el funcionario',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                funcionario: funcionarioGuardado,
                usuario: req.usuario._id
            });
        });

    });

});

// ==============================================
//  Borrar un Feriado legal por el id
// ==============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Funcionario.findByIdAndRemove(id, (err, funcionarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar funcionario',
                errors: err
            });
        }

        if (!funcionarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un funcionario con ese id',
                errors: { message: 'No existe un funcionario con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            funcionario: funcionarioBorrado
        });
    });
});

module.exports = app;