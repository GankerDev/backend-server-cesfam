var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var permisoSchema = new Schema({
    fecha: { type: Date, required: true },
    dias_fijos: { type: Number, required: true },
    tiempo_permiso: { type: Number, required: true },
    dias_restantes: { type: Number },
    dias_adm_fijos: { type: Number, required: true },
    dias_adm_acumulados: { type: Number },
    funcionario: { type: Schema.Types.ObjectId, ref: 'funcionario' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    tipoPermisos: { type: Schema.Types.ObjectId, ref: 'tipoPermisos', required: [true, 'El id tipo permiso es un campo obligatorio'] }
}, { collection: 'permiso' });

module.exports = mongoose.model('permiso', permisoSchema);