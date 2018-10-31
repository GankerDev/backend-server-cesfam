var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var feriadoLegalSchema = new Schema({
    dias_vacaciones_fijos: { type: Number, required: true },
    dias_vacaciones_acumulados: { type: Number, required: true },
    fecha_inicio_vacaciones: { type: Date, required: true },
    fecha_termino_vacaciones: { type: Date, required: true },
    dias_vacaciones_restantes: { type: Number, required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'feriadoLegal' });

module.exports = mongoose.model('feriadoLegal', feriadoLegalSchema);