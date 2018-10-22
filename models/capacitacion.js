var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var capacitacionSchema = new Schema({
    nombre_capacitacion: { type: String, required: true },
    descripcion_capacitacion: { type: String },
}, { collection: 'capacitacion' });

module.exports = mongoose.model('capacitacion', capacitacionSchema);