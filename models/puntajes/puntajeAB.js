var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var puntajeABSchema = new Schema({
    nivel: { type: String },
    rango_min: { type: Number },
    rango_max: { type: Number },
}, { collection: 'puntajeAB' });

module.exports = mongoose.model('puntajeAB', puntajeABSchema);