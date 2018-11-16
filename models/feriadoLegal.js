var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var feriadoLegalSchema = new Schema({
    dias_vacaciones_fijos: { type: Number, required: true },
    dias_vacaciones_acumulados: { type: Number },
    fecha_inicio_vacaciones: { type: Date },
    fecha_termino_vacaciones: { type: Date },
    dias_vacaciones_restantes: { type: Number },
    funcionario: { type: Schema.Types.ObjectId, ref: 'funcionario' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'feriadoLegal' });

module.exports = mongoose.model('feriadoLegal', feriadoLegalSchema);