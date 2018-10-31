var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var capacitacionSchema = new Schema({
    nombre_capacitacion: { type: String, required: true },
    descripcion_capacitacion: { type: String },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'capacitacion' });

module.exports = mongoose.model('capacitacion', capacitacionSchema);