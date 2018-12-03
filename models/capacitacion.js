var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var capacitacionSchema = new Schema({
    nombre_capacitacion: { type: String, required: true },
    duracion: { type: Number, required: true },
    descripcion_capacitacion: { type: String },
    nota: { type: Number },
    cap_nivel_tecnico: { type: Schema.Types.ObjectId, ref: 'capacitacionNivelTecnico' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'capacitacion' });

module.exports = mongoose.model('capacitacion', capacitacionSchema);